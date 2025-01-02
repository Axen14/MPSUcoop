# Generated by Django 4.2.1 on 2024-12-30 16:40

from decimal import Decimal
from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('account_number', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('shareCapital', models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=15, validators=[django.core.validators.MinValueValidator(Decimal('0.00'))])),
                ('status', models.CharField(choices=[('Active', 'Active'), ('Closed', 'Closed')], max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Loan',
            fields=[
                ('control_number', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('loan_amount', models.DecimalField(decimal_places=2, max_digits=15)),
                ('loan_type', models.CharField(choices=[('Regular', 'Regular'), ('Emergency', 'Emergency')], default='Emergency', max_length=200)),
                ('interest_rate', models.DecimalField(decimal_places=2, default=Decimal('5.00'), max_digits=5)),
                ('loan_period', models.PositiveIntegerField(default=6)),
                ('loan_period_unit', models.CharField(choices=[('months', 'Months'), ('years', 'Years')], default='months', max_length=10)),
                ('loan_date', models.DateField(auto_now_add=True)),
                ('due_date', models.DateField(blank=True, null=True)),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Paid-off', 'Paid-off')], default='Pending', max_length=50)),
                ('service_fee', models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=15)),
                ('takehomePay', models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=15)),
                ('penalty_rate', models.DecimalField(decimal_places=2, default=Decimal('2.00'), max_digits=5)),
                ('purpose', models.CharField(choices=[('Education', 'Education'), ('Medical/Emergency', 'Medical/Emergency'), ('House Construction & Repair', 'House Construction & Repair'), ('Commodity/Appliances', 'Commodity/Appliances'), ('Utility Services', 'Utility Services'), ('Others', 'Others')], default='Education', max_length=200)),
                ('annual_interest', models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=5)),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='mcoop_app.account')),
            ],
        ),
        migrations.CreateModel(
            name='SystemSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('interest_rate', models.DecimalField(decimal_places=2, default=Decimal('5.00'), max_digits=5, verbose_name='Interest Rate')),
                ('service_fee_rate_emergency', models.DecimalField(decimal_places=2, default=Decimal('0.01'), max_digits=5, verbose_name='Emergency Loan Service Fee Rate')),
                ('penalty_rate', models.DecimalField(decimal_places=2, default=Decimal('2.00'), max_digits=5, verbose_name='Penalty Rate')),
                ('service_fee_rate_regular_1yr', models.DecimalField(decimal_places=3, default=Decimal('0.010'), max_digits=5, verbose_name='Regular Loan Service Fee Rate (<=1 year)')),
                ('service_fee_rate_regular_2yr', models.DecimalField(decimal_places=3, default=Decimal('0.015'), max_digits=5, verbose_name='Regular Loan Service Fee Rate (<=2 years)')),
                ('service_fee_rate_regular_3yr', models.DecimalField(decimal_places=3, default=Decimal('0.020'), max_digits=5, verbose_name='Regular Loan Service Fee Rate (<=3 years)')),
                ('service_fee_rate_regular_4yr', models.DecimalField(decimal_places=3, default=Decimal('0.025'), max_digits=5, verbose_name='Regular Loan Service Fee Rate (>3 years)')),
            ],
        ),
        migrations.CreateModel(
            name='PaymentSchedule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('principal_amount', models.DecimalField(decimal_places=2, max_digits=15)),
                ('interest_amount', models.DecimalField(decimal_places=2, max_digits=15)),
                ('payment_amount', models.DecimalField(decimal_places=2, default=0.0, max_digits=15)),
                ('service_fee_component', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('due_date', models.DateField()),
                ('balance', models.DecimalField(decimal_places=2, max_digits=15)),
                ('is_paid', models.BooleanField(default=False)),
                ('loan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='mcoop_app.loan')),
            ],
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('OR', models.CharField(max_length=50, primary_key=True, serialize=False, unique=True)),
                ('amount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('method', models.CharField(choices=[('Cash', 'Cash'), ('Bank Transfer', 'Bank Transfer')], max_length=50)),
                ('payment_schedule', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payments', to='mcoop_app.paymentschedule')),
            ],
        ),
        migrations.CreateModel(
            name='Member',
            fields=[
                ('memId', models.AutoField(primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=100)),
                ('middle_name', models.CharField(blank=True, max_length=100, null=True)),
                ('last_name', models.CharField(max_length=100)),
                ('birth_date', models.DateField()),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('phone_number', models.CharField(max_length=12)),
                ('gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female')], default='Male', max_length=20)),
                ('religion', models.CharField(default='Catholic', max_length=100)),
                ('pstatus', models.CharField(choices=[('Single', 'Single'), ('Married', 'Married'), ('Widower', 'Widower'), ('Separated', 'Separated')], default='Single', max_length=50)),
                ('address', models.TextField(blank=True, default='Not Provided')),
                ('account_number', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='member', to='mcoop_app.account')),
                ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='member_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='loan',
            name='system_settings',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='mcoop_app.systemsettings'),
        ),
        migrations.CreateModel(
            name='Ledger',
            fields=[
                ('ledger_id', models.AutoField(primary_key=True, serialize=False)),
                ('transaction_type', models.CharField(choices=[('Deposit', 'Deposit'), ('Withdrawal', 'Withdrawal')], max_length=20)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=15)),
                ('description', models.TextField()),
                ('balance_after_transaction', models.DecimalField(decimal_places=2, max_digits=15)),
                ('timestamp', models.DateTimeField(auto_now=True)),
                ('account_number', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ledger_entries', to='mcoop_app.account')),
            ],
        ),
        migrations.AddField(
            model_name='account',
            name='account_holder',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='accountN', to='mcoop_app.member'),
        ),
    ]