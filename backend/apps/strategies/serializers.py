from rest_framework import serializers
from .models import StrategyTemplate, UserStrategy, StrategyLeg

class StrategyLegSerializer(serializers.ModelSerializer):
    class Meta:
        model = StrategyLeg
        fields = '__all__'

class UserStrategySerializer(serializers.ModelSerializer):
    legs = StrategyLegSerializer(many=True, read_only=True)
    
    class Meta:
        model = UserStrategy
        fields = '__all__'

class StrategyTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StrategyTemplate
        fields = '__all__'