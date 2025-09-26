from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Transaction
from .serializers import TransactionSerializer, TransactionCreateSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('-created_at')

    def get_serializer_class(self):
        if self.action == 'create':
            return TransactionCreateSerializer
        return TransactionSerializer

    def get_permissions(self):
        # listar y recuperar requieren autenticación
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        # crear (registro de transacción) público
        return [AllowAny()]
