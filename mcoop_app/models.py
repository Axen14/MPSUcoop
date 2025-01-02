from django.db import models
from decimal import Decimal, ROUND_HALF_UP
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator 
import uuid
from datetime import date
from django.utils.timezone import now
import math
from django.db.models import Sum
from django.core.exceptions import ValidationError
import logging
logger = logging.getLogger(__name__)

# class CustomUser(AbstractUser):
#     is_member = models.BooleanField(default=False)
#     is_admin = models.BooleanField(default=False)

#     def __str__(self):
#         return self.username

class SystemSettings(models.Model):
   
    interest_rate = models.DecimalField(
        max_digits=5, decimal_places=2, default=Decimal('5.00'), verbose_name="Interest Rate"
    )
    service_fee_rate_emergency = models.DecimalField(
        max_digits=5, decimal_places=2, default=Decimal('0.01'), verbose_name="Emergency Loan Service Fee Rate"
    )
    penalty_rate = models.DecimalField(
        max_digits=5, decimal_places=2, default=Decimal('2.00'), verbose_name="Penalty Rate"
    )
    service_fee_rate_regular_1yr = models.DecimalField(
        max_digits=5, decimal_places=3, default=Decimal('0.010'),
        verbose_name="Regular Loan Service Fee Rate (<=1 year)"
    )
    service_fee_rate_regular_2yr = models.DecimalField(
        max_digits=5, decimal_places=3, default=Decimal('0.015'),
        verbose_name="Regular Loan Service Fee Rate (<=2 years)"
    )
    service_fee_rate_regular_3yr = models.DecimalField(
        max_digits=5, decimal_places=3, default=Decimal('0.020'),
        verbose_name="Regular Loan Service Fee Rate (<=3 years)"
    )
    service_fee_rate_regular_4yr = models.DecimalField(
        max_digits=5, decimal_places=3, default=Decimal('0.025'),
        verbose_name="Regular Loan Service Fee Rate (>3 years)"
    )

    def __str__(self):
        return "System Settings"

    @staticmethod
    def get_settings():
        # Ensure only one instance exists
        settings, created = SystemSettings.objects.get_or_create(pk=1)
        return settings

    def get_regular_loan_service_fee_rate(self, total_years):
        """
        Determine the service fee rate for a regular loan based on the term.
        """
        if total_years <= 1:
            return self.service_fee_rate_regular_1yr
        elif total_years <= 2:
            return self.service_fee_rate_regular_2yr
        elif total_years <= 3:
            return self.service_fee_rate_regular_3yr
        else:
            return self.service_fee_rate_regular_4yr

    def __str__(self):
        return f"System Settings (Interest Rate: {self.interest_rate}%)"

class Member(models.Model):
    memId = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100)
    birth_date = models.DateField()   
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=12)
    gender = models.CharField(max_length=20, choices=[('Male', 'Male'), ('Female', 'Female')], default='Male')
    religion = models.CharField(max_length=100, default='Catholic')
    pstatus = models.CharField(max_length=50, choices=[('Single', 'Single'), ('Married', 'Married'), ('Widower', 'Widower'), ('Separated', 'Separated')], default='Single')
    address = models.TextField(blank=True, default='Not Provided')
    account_number = models.OneToOneField('Account', on_delete=models.CASCADE, null=True, blank=True, related_name='member')
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='member_profile')

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Account(models.Model):
    account_number = models.CharField(max_length=20, primary_key=True)
    account_holder = models.OneToOneField(Member, on_delete=models.CASCADE, related_name='accountN')
    shareCapital = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'), validators=[MinValueValidator(Decimal('0.00'))])
    status = models.CharField(max_length=50, choices=[('Active', 'Active'), ('Closed', 'Closed')])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def deposit(self, amount):
        if self.status == 'Active':
            self.shareCapital += Decimal(amount)  
            self.save()

         
            Ledger.objects.create(
                account_number=self,
                transaction_type='Deposit',
                amount=Decimal(amount),
                description=f"Deposit to account {self.account_number}",
                balance_after_transaction=self.shareCapital
            )
        else:
            logger.error(f"Deposit failed: Account {self.account_number} is not active.")
            raise ValueError("Account is not active. Cannot deposit.")

    def withdraw(self, amount):
        if self.status == 'Active':
            if self.shareCapital >= Decimal(amount):
                self.shareCapital -= Decimal(amount)
                self.save()

                Ledger.objects.create(
                    account_number=self,
                    transaction_type='Withdrawal',
                    amount=Decimal(amount),
                    description=f"Withdrawal from account {self.account_number}",
                    balance_after_transaction=self.shareCapital
                )
            else:
                logger.error(f"Withdrawal failed: Insufficient funds in account {self.account_number}.")
                raise ValueError("Insufficient funds.")
        else:
            logger.error(f"Withdrawal failed: Account {self.account_number} is not active.")
            raise ValueError("Account is not active. Cannot withdraw.")

    def __str__(self):
        return f"Account {self.account_number} - {self.account_holder.memId}"





class Loan(models.Model):
    PURPOSE_CHOICES = [
        ('Education', 'Education'),
        ('Medical/Emergency', 'Medical/Emergency'),
        ('House Construction & Repair', 'House Construction & Repair'),
        ('Commodity/Appliances', 'Commodity/Appliances'),
        ('Utility Services', 'Utility Services'),
        ('Others', 'Others'),
    ]

    control_number = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    account = models.ForeignKey('Account', on_delete=models.CASCADE)
    loan_amount = models.DecimalField(max_digits=15, decimal_places=2)
    loan_type = models.CharField(
        max_length=200, choices=[('Regular', 'Regular'), ('Emergency', 'Emergency')], default='Emergency'
    )
    system_settings = models.ForeignKey(SystemSettings, on_delete=models.SET_NULL, null=True, blank=True)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('5.00')) 
    loan_period = models.PositiveIntegerField(default=6)  
    loan_period_unit = models.CharField(
        max_length=10, choices=[('months', 'Months'), ('years', 'Years')], default='months'
    )
    loan_date = models.DateField(auto_now_add=True)
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=50,choices=[('Pending', 'Pending'), ('Paid-off', 'Paid-off')],
        default='Pending'
    )
    service_fee = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    takehomePay = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))
    penalty_rate = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('2.00'))
    purpose = models.CharField(max_length=200, choices=PURPOSE_CHOICES, default='Education')
    annual_interest = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00')) 



    def save(self, *args, **kwargs):
        
        if not self.system_settings:
            self.system_settings = SystemSettings.get_settings()
        
        if not self.loan_date:
            self.loan_date = timezone.now().date()
            
        if not self.interest_rate:
            self.interest_rate = self.system_settings.interest_rate
        
        if not self.penalty_rate:
            self.penalty_rate = self.system_settings.penalty_rate
            
        # service fee is based on loan duration/ term
        self.calculate_service_fee()
        
        self.takehomePay = self.loan_amount - self.service_fee
        
        if not self.due_date:
            self.due_date = self.calculate_due_date()
    
        super().save(*args, **kwargs)

        if self.status == 'Pending':
            self.generate_payment_schedule()
    
    def calculate_service_fee(self):
        """Calculate the service fee based on loan duration."""
        total_years = self.loan_period if self.loan_period_unit == 'years' else self.loan_period / 12
        
        if self.loan_type == 'Emergency':
            self.service_fee = self.loan_amount * self.system_settings.service_fee_rate_emergency
        else:
            rate = self.system_settings.get_regular_loan_service_fee_rate(total_years)
            self.service_fee = self.loan_amount * rate.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


        
    def calculate_due_date(self):
        """
        Calculates the due date based on the loan period and start date.
        """
        if self.loan_period_unit == 'months':
            return self.loan_date + timedelta(days=self.loan_period * 30)
        else:
            return self.loan_date + timedelta(days=self.loan_period * 365)
        return None

    def check_loan_eligibility_for_reloan(self):
        """Check if at least 50% of the loan is paid off."""
        total_paid = self.payments.aggregate(total_paid=Sum('payment_amount'))['total_paid'] or 0
        return total_paid >= (self.loan_amount / 2)
    def generate_payment_schedule(self):
        """Generates bi-monthly payment schedule and distributes service fees."""
        if PaymentSchedule.objects.filter(loan=self).exists():
            return
        
        total_months = self.loan_period * (12 if self.loan_period_unit == 'years' else 1)
        total_periods = total_months * 2  
        bi_monthly_rate = (self.interest_rate / Decimal('100')) / 24  

        # Bi-monthly payments calculation
        loan_principal = self.loan_amount
        total_interest = loan_principal * bi_monthly_rate * total_periods
        total_amount_due = loan_principal + total_interest
        bi_monthly_payment = total_amount_due / Decimal(total_periods)

        

        for period in range(total_periods):
            due_date = self.loan_date + timedelta(days=(period * 15))
            principal_payment = loan_principal / Decimal(total_periods)
            interest_payment = total_interest / Decimal(total_periods)
            balance_due = total_amount_due - (bi_monthly_payment * (period + 1))

            service_fee_component = self.service_fee / total_periods

            PaymentSchedule.objects.create(
                loan=self,
                principal_amount=principal_payment.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
                interest_amount=interest_payment.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
                payment_amount=bi_monthly_payment.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
                service_fee_component=service_fee_component.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP),
                due_date=due_date,
                balance=balance_due.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
            )

    def __str__(self):
        return f"Loan {self.control_number} for {self.account} ({self.status})"

class PaymentSchedule(models.Model):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE)
    principal_amount = models.DecimalField(max_digits=15, decimal_places=2)
    interest_amount = models.DecimalField(max_digits=15, decimal_places=2)
    payment_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0.0)
    service_fee_component = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    due_date = models.DateField()
    balance = models.DecimalField(max_digits=15, decimal_places=2)
    is_paid = models.BooleanField(default=False)

    def __str__(self):
        return f"Payment for Loan {self.loan.control_number} on {self.due_date}"

    def mark_as_paid(self):
        if self.balance <= Decimal('0.00'):       
            self.is_paid = True
            self.save()
    def calculate_service_fee_component(self):
        """Recalculate service fee based on remaining balance."""
        remaining_balance_ratio = self.balance / self.loan.loan_amount
        self.service_fee_component = (self.loan.service_fee * remaining_balance_ratio).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

    def save(self, *args, **kwargs):
        self.calculate_service_fee_component()
        super().save(*args, **kwargs)

    def calculate_payment_amount(self):
        """Calculates the total amount due, including service fees."""
        self.calculate_service_fee_component()
        self.payment_amount = self.principal_amount + self.interest_amount + self.service_fee_component

    def save(self, *args, **kwargs):
        self.calculate_payment_amount()
        super().save(*args, **kwargs)
    def __str__(self):
        return f"Payment Schedule for {self.account_number}"
    def __str__(self):
        if self.loan and self.loan.account:
            return f"Payment Schedule for {self.loan.account.account_number}"
        return "Payment Schedule (Account Info Missing)"

class Payment(models.Model):
    OR = models.CharField(max_length=50, primary_key=True, unique=True)
    payment_schedule = models.ForeignKey(PaymentSchedule, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default = 0)
    date = models.DateField(default=now)
    method = models.CharField(max_length=50, choices=[('Cash', 'Cash'), ('Bank Transfer', 'Bank Transfer')])

    def save(self, *args, **kwargs):
        if self.amount > self.payment_schedule.balance:
            raise ValidationError("Payment amount exceeds the remaining balance.")
        
        super().save(*args, **kwargs)
        
        self.payment_schedule.balance -= self.amount
        self.payment_schedule.mark_as_paid()


class Ledger(models.Model):
    ledger_id = models.AutoField(primary_key=True)  
    account_number = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='ledger_entries')
    transaction_type = models.CharField(max_length=20, choices=[('Deposit', 'Deposit'), ('Withdrawal', 'Withdrawal')])
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    description = models.TextField()
    balance_after_transaction = models.DecimalField(max_digits=15, decimal_places=2)
    timestamp = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.transaction_type} of {self.amount} on {self.timestamp}"

