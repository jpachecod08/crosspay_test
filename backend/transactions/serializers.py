from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            'id','currency','amount','description','payer_name',
            'document_type','document_number','card_number_masked',
            'card_expiry','card_cvv_masked','created_at'
        ]
        read_only_fields = ['id','created_at','card_number_masked','card_cvv_masked']

class TransactionCreateSerializer(serializers.ModelSerializer):
    # campos escritos por el cliente (write_only)
    card_number = serializers.CharField(write_only=True)
    cvv = serializers.CharField(write_only=True)

    class Meta:
        model = Transaction
        fields = [
            'currency','amount','description','payer_name',
            'document_type','document_number','card_number','cvv','card_expiry'
        ]

    def create(self, validated_data):
        card_number = validated_data.pop('card_number', '')
        cvv = validated_data.pop('cvv', '')
        # mascarar la tarjeta: conservar últimos 4 dígitos
        masked_card = '**** **** **** ' + card_number[-4:] if len(card_number) >= 4 else card_number
        validated_data['card_number_masked'] = masked_card
        validated_data['card_cvv_masked'] = '***'  # nunca guardar CVV real
        return super().create(validated_data)
