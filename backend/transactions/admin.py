from django.contrib import admin
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id','payer_name','amount','currency','document_type','created_at')
    search_fields = ('payer_name','document_number','card_number_masked')
    list_filter = ('currency','document_type')
    readonly_fields = ('card_number_masked','card_cvv_masked','created_at')
