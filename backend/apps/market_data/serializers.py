from rest_framework import serializers
from .models import Stock


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        # Fields from your Stock model
        fields = ['id', 'symbol', 'company_name', 'exchange', 'sector', 'last_price', 'volume', 'updated_at']