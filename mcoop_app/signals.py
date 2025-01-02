from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.utils import timezone
from .models import Member, Account, Loan, Payment, PaymentSchedule
import uuid
from decimal import Decimal

@receiver(post_save, sender=Member)
def create_account_for_member(sender, instance, created, **kwargs):
    if created:
        Account.objects.create(
            account_number=str(uuid.uuid4())[:12].upper(),
            account_holder=instance,
            shareCapital=Decimal('0.00'),
            status='Active'
        )
@receiver(post_save, sender=Loan)
def handle_loan_post_save(sender, instance, created, **kwargs):
    if created and instance.status == 'Pending':
        if not instance.due_date:
            instance.generate_payment_schedule()


@receiver(post_save, sender=Payment)
def update_payment_and_loan_status(sender, instance, created, **kwargs):
    if created:
        
        payment_schedule = instance.payment_schedule
        if payment_schedule:
            payment_schedule.balance -= instance.amount
            payment_schedule.is_paid = payment_schedule.balance <= 0
            payment_schedule.save()

        
        loan = payment_schedule.loan
        if loan.payment_schedules.filter(is_paid=False).count() == 0:
            loan.status = 'Paid'
            loan.save()

        
        instance.description = f"Payment of {instance.amount} recorded on {timezone.now().strftime('%Y-%m-%d %H:%M:%S')}"
        instance.transaction_type = "Payment"  
        instance.save(update_fields=['description', 'transaction_type'])

        
        send_mail(
            subject='Payment Confirmation',
            message=f'Thank you! Your payment of {instance.amount} has been received.',
            from_email='noreply@yourdomain.com',
            recipient_list=[loan.account.account_holder.email],
        )