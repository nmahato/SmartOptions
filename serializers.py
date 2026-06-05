from rest_framework import serializers
from .models import Stock


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        # Assuming your Stock model has at least these fields.
        # Adjust fields based on your actual model definition.
        fields = ['id', 'ticker', 'name', 'exchange', 'sector', 'industry']