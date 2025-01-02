from rest_framework import serializers
from django.contrib.auth.models import User
from decimal import Decimal
from .models import Member, Account, Loan, PaymentSchedule, Payment,Ledger,SystemSettings
from django.contrib.auth import authenticate
import uuid
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class SystemSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSettings
        fields = '__all__'
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class MemberTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Check username or account_number
        username_or_account = attrs.get("username") or attrs.get("account_number")
        password = attrs.get("password")
        
        # Authenticate user
        user = authenticate(username=username_or_account, password=password)
        if user and hasattr(user, 'member_profile'):
            data = super().validate(attrs)
            
            # Access the member profile
            member = user.member_profile
            
            # Verify accountN and account_number
            if not member.accountN or not member.accountN.account_number:
                raise serializers.ValidationError("Account information is missing or invalid.")
            
            # Add custom fields to the response
            data.update({
                'user_id': user.id,
                'account_number': member.accountN.account_number,
                'email': user.email,
            })
            return data
        
        # Raise error if credentials are invalid
        raise serializers.ValidationError("Invalid member credentials.")


class MemberSerializer(serializers.ModelSerializer):
    accountN = serializers.CharField(source='accountN.account_number', read_only=True)
    share_capital = serializers.DecimalField(source='accountN.shareCapital', max_digits=15, decimal_places=2, read_only=True)
    # password = serializers.CharField(write_only=True)
    user = UserSerializer(read_only=True) 

    class Meta:
        model = Member
        fields = ['memId','accountN','share_capital',  'first_name', 'last_name', 'email', 'phone_number', "birth_date", 'gender','religion', 'pstatus', 'address','user']


    def get_accountN(self, obj):
        return obj.accountN.account_number if hasattr(obj, 'accountN') else None
    


    def create(self, validated_data):
        account_data = validated_data.pop('accountN', None)
        member = Member.objects.create(**validated_data)

        if account_data:
            Account.objects.create(account_holder=member, **account_data)
        
        return member
class AccountSerializer(serializers.ModelSerializer):
    account_holder = MemberSerializer(read_only=True)
    class Meta:
        model = Account
        fields = ['account_number', 'account_holder', 'shareCapital', 'status', 'created_at', 'updated_at']
class PaymentScheduleSerializer(serializers.ModelSerializer):

    class Meta:
        model = PaymentSchedule
        fields = ['id', 'loan', 'principal_amount', 'interest_amount', 'payment_amount', 
                  'due_date', 'balance', 'is_paid', 'service_fee_component']

class LoanSerializer(serializers.ModelSerializer):
    control_number = serializers.ReadOnlyField()
    bi_monthly_installment = serializers.SerializerMethodField()
    payment_schedule = PaymentScheduleSerializer(source='paymentschedule_set', many=True, read_only=True)

    class Meta:
        model = Loan
        fields = ['control_number', 'account', 'loan_amount', 'loan_type', 'interest_rate', 
                  'loan_period', 'loan_period_unit', 'loan_date', 'due_date', 'status', 'takehomePay',
                  'service_fee','penalty_rate', 'purpose', 'bi_monthly_installment', 'payment_schedule']
        read_only_fields = ['control_number', 'loan_date', 'due_date', 'interest_rate',  'penalty_rate']
    def validate_control_number(self, value):
        try:
            uuid.UUID(str(value))
        except ValueError:
            raise serializers.ValidationError("Invalid UUID format.")
        return value
    def get_bi_monthly_installment(self, obj):
        total_periods = (obj.loan_period * 2) if obj.loan_period_unit == 'years' else obj.loan_period * 2
        bi_monthly_rate = (obj.interest_rate / Decimal('100')) / 24  
        total_interest = (obj.loan_amount * bi_monthly_rate * total_periods)
        total_amount_due = obj.loan_amount + total_interest
        bi_monthly_payment = total_amount_due / Decimal(total_periods)
        return bi_monthly_payment.quantize(Decimal('0.01'))

    def create(self, validated_data):
        loan = Loan.objects.create(**validated_data)
        if loan.status == 'Pending':
            loan.generate_payment_schedule()
        return loan



class PaymentSerializer(serializers.ModelSerializer):
        class Meta:
            model = Payment
            fields = '__all__'
            
        def to_representation(self, instance):
            data = super().to_representation(instance)
            data['control_number'] = str(instance.control_number)
            return data
class LedgerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ledger
        fields = '__all__'

