from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import (
    InitSerializer,
    WalletSerializer,
    DepositSerializer,
    WithdrawalSerializer,
)
from knox.models import AuthToken
from .models import User, Wallet, Deposit, Withdrawals
from django.utils import timezone
from django.db import IntegrityError
from django.db import transaction
from uuid import uuid4


class InitView(GenericAPIView):
    serializer_class = InitSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            data = serializer.validated_data
            user = User.objects.get(id=data["customer_xid"])
            obj, created = Wallet.objects.get_or_create(owned_by=user)
            token = AuthToken.objects.create(user)[1]
        return Response(data={"token": token}, status=status.HTTP_200_OK)


class WalletView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WalletSerializer

    def get(self, request):
        wallet = request.user.wallet
        return Response(
            data=WalletSerializer(wallet, context=self.get_serializer_context()).data,
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        wallet = request.user.wallet
        if not wallet.status:
            wallet.status = True
            wallet.enabled_at = timezone.now()
            wallet.save()
            return Response(
                data=WalletSerializer(
                    wallet, context=self.get_serializer_context()
                ).data,
                status=status.HTTP_201_CREATED,
            )
        return Response(
            data={"detail": "Wallet is already enabled"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def patch(self, request):
        wallet = request.user.wallet
        is_disabled = request.data.get("is_disabled", None)
        if is_disabled is not None:
            wallet.status = not is_disabled
            wallet.disabled_at = timezone.now()
            wallet.save()
            return Response(
                data=WalletSerializer(
                    wallet, context=self.get_serializer_context()
                ).data,
                status=status.HTTP_200_OK,
            )
        return Response(
            data={"detail": "Already disabled"}, status=status.HTTP_400_BAD_REQUEST
        )


class DepositeView(GenericAPIView):
    serializer_class = DepositSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            wallet = request.user.wallet
            data = serializer.validated_data
            reference_id = data["reference_id"]
            amount = data["amount"]
            if wallet.status:
                try:
                    deposit = Deposit.objects.create(
                        id=uuid4(),
                        wallet=wallet,
                        deposited_by=request.user,
                        amount=amount,
                        reference_id=reference_id,
                    )
                    wallet.balance = wallet.balance + amount
                    wallet.save()
                    return Response(
                        data=DepositSerializer(
                            deposit, context=self.get_serializer_context()
                        ).data,
                        status=status.HTTP_201_CREATED,
                    )
                except IntegrityError as e:
                    print(e)
                    if "UNIQUE constraint" in e.args:
                        return Response(
                            data={"detail": "reference_id is not unique"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response(
                data={"detail": "Please enable wallet first to make transactions"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class WithDrawalView(GenericAPIView):
    serializer_class = DepositSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            wallet = request.user.wallet
            data = serializer.validated_data
            reference_id = data["reference_id"]
            amount = data["amount"]
            if wallet.status:
                if amount < wallet.balance:
                    with transaction.atomic():
                        try:
                            withdrawal = Withdrawals.objects.create(
                                id=uuid4(),
                                withdrawn_by=request.user,
                                amount=amount,
                                reference_id=reference_id,
                                wallet=wallet,
                            )
                            wallet.balance -= amount
                            wallet.save()
                        except IntegrityError:
                            return Response(
                                data={"detail": "Reference ID already exits"},
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                        return Response(
                            data=WithdrawalSerializer(
                                withdrawal, context=self.get_serializer_context()
                            ).data,
                            status=status.HTTP_201_CREATED,
                        )
                return Response(
                    data={"detail": "Insufficient Balance"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(
                data={"detail": "Please enable wallet first to make transactions"},
                status=status.HTTP_400_BAD_REQUEST,
            )
