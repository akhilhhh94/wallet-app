from rest_framework import serializers
from .models import User, Wallet, Deposit, Withdrawals
from django.contrib.auth import authenticate


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:

            return user
        raise serializers.ValidationError("Incorrect Credentials")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "username"]


class InitSerializer(serializers.Serializer):
    customer_xid = serializers.UUIDField(format="hex_verbose")


class WalletSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField("get_status")

    class Meta:
        model = Wallet
        fields = ["id", "owned_by", "status", "enabled_at", "balance", "disabled_at"]

    def get_status(self, instance):
        status = instance.status
        return "enabled" if status else "disabled"


class DepositSerializer(serializers.ModelSerializer):
    wallet = WalletSerializer(read_only=True)

    class Meta:
        model = Deposit
        fields = "__all__"
        read_only_fields = ["id", "deposited_by", "wallet"]


class WithdrawalSerializer(serializers.ModelSerializer):
    wallet = WalletSerializer(read_only=True)

    class Meta:
        model = Withdrawals
        fields = "__all__"
        read_only_fields = ["id", "withdrawn_by", "wallet"]
