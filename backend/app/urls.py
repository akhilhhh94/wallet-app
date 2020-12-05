from django.urls import path
from .views import InitView, WalletView, DepositeView, WithDrawalView
from .auth import LoginAPI

app_name = "app"

urlpatterns = [
    path("auth/login", LoginAPI.as_view()),
    path("init", InitView.as_view()),
    path("wallet", WalletView.as_view()),
    path("wallet/deposits", DepositeView.as_view()),
    path("wallet/withdrawals", WithDrawalView.as_view()),
]
