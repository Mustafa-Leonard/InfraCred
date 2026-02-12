from django.urls import path
from .views import ConfirmationCreateView, UserReputationView

urlpatterns = [
    path('me/', UserReputationView.as_view(), name='my-reputation'),
    path('confirm/<int:report_id>/', ConfirmationCreateView.as_view(), name='confirm-report'),
]
