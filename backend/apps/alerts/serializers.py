from rest_framework import serializers
from .models import Alert

class AlertSerializer(serializers.ModelSerializer):
    stock_symbol = serializers.CharField(source='stock.symbol', read_only=True)
    
    class Meta:
        model = Alert
        fields = '__all__'