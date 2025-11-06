from rest_framework import serializers
from .models import FlowData, MarketNews

class FlowDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlowData
        fields = '__all__'

class MarketNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketNews
        fields = '__all__'