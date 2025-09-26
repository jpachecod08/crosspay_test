from django.db import models
from django.utils import timezone

class Transaction(models.Model):
    CURRENCY_CHOICES = (('COP','COP'), ('USD','USD'))
    DOC_TYPE_CHOICES = (('Cedula','Cédula'), ('Pasaporte','Pasaporte'))

    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.CharField(max_length=255, blank=True)
    payer_name = models.CharField(max_length=200)
    document_type = models.CharField(max_length=20, choices=DOC_TYPE_CHOICES)
    document_number = models.CharField(max_length=50)
    card_number_masked = models.CharField(max_length=30, blank=True)
    card_expiry = models.CharField(max_length=7, blank=True)  # ejemplo "12/26"
    card_cvv_masked = models.CharField(max_length=10, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.payer_name} - {self.amount} {self.currency} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
