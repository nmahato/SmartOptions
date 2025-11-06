from django.contrib import admin
from .models import Stock, OptionsChain

@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ('symbol', 'company_name', 'last_price', 'volume')
    search_fields = ('symbol', 'company_name')

@admin.register(OptionsChain)
class OptionsChainAdmin(admin.ModelAdmin):
    list_display = ('stock', 'option_type', 'strike_price', 'expiry_date', 'last_price')
    list_filter = ('option_type', 'expiry_date')
    search_fields = ('stock__symbol',)