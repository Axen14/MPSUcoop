from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import (
    MemberViewSet, 
    AccountViewSet, 
    LoanViewSet,
    PaymentScheduleViewSet,
    PaymentViewSet,
    UserListView, ResetPasswordView,
    ActiveLoansByAccountView,RegisterMemberView, AccountTransactionView, MemberLoginView,LogoutView, MemberProfileView, MemberLoanListView, TokenObtainPairView, SystemSettingsView,
    payment_schedules_by_loan, AccountDetailView, get_payments
)
from rest_framework_simplejwt import views as jwt_views

router = DefaultRouter()
router.register(r'members', MemberViewSet )  
router.register(r'accounts', AccountViewSet)
router.register(r'loans', LoanViewSet) 
router.register(r'payment-schedules', PaymentScheduleViewSet, basename='payment-schedules')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
    path('users/', UserListView.as_view(), name='user_list'),
    path('api/account/<str:account_number>/transactions/', AccountTransactionView.as_view(), name='account-transactions'),
    path('users/<int:pk>/reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    path('payment-schedules/<int:id>/mark-paid/', views.mark_as_paid, name='mark_as_paid'),
    path('register/', RegisterMemberView.as_view(), name='register_member'),  
    path('login/member/', views.member_login, name='member-login'),   
    path('login/admin/', jwt_views.TokenObtainPairView.as_view(), name='admin_login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),  
    path('api/member/profile/', MemberProfileView.as_view(), name='member-profile'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/system-settings/', SystemSettingsView.as_view(), name='system-settings'),
    path('api/loans/by_account/', LoanViewSet.as_view({'get': 'by_account'})),
    path('api/payment-schedules/<str:loan_control_number>/', payment_schedules_by_loan, name='payment-schedules-by-loan'),
    path('api/loans/<uuid:control_number>/', LoanViewSet.as_view({'get': 'retrieve'})),
    path('api/payments/<uuid:control_number>/', views.get_payments, name='get_payments'),
 
    path('api/account/details/', AccountDetailView.as_view(), name='account-details'),

]