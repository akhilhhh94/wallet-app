from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# Create your models here.
class User(AbstractUser):
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    id = models.UUIDField(unique=True, primary_key=True, default=uuid.uuid4())
    email = models.EmailField(
        blank=True, max_length=254, verbose_name="email address", unique=True
    )


class Wallet(models.Model):

    id = models.UUIDField(unique=True, primary_key=True, default=uuid.uuid4())
    status = models.BooleanField(default=False)
    owned_by = models.OneToOneField(
        User, related_name="wallet", on_delete=models.CASCADE
    )
    balance = models.FloatField(default=0.0)
    enabled_at = models.DateTimeField(auto_now_add=False, null=True)
    disabled_at = models.DateTimeField(auto_now_add=False, null=True)


class Deposit(models.Model):
    id = models.UUIDField(unique=True, primary_key=True, default=uuid.uuid4())
    deposited_by = models.ForeignKey(
        User, related_name="deposits", on_delete=models.CASCADE
    )
    deposited_at = models.DateTimeField(auto_now_add=True)
    amount = models.FloatField()
    reference_id = models.UUIDField()
    wallet = models.ForeignKey(
        Wallet, related_name="deposits", on_delete=models.CASCADE
    )


class Withdrawals(models.Model):
    id = models.UUIDField(unique=True, primary_key=True, default=uuid.uuid4())
    withdrawn_by = models.ForeignKey(
        User, related_name="withdrawals", on_delete=models.CASCADE
    )
    withdrawn_at = models.DateTimeField(auto_now_add=True)
    amount = models.FloatField()
    reference_id = models.UUIDField()
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)
