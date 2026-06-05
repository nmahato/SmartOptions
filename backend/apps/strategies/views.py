from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import numpy as np
from .models import StrategyTemplate, UserStrategy, StrategyLeg
from .serializers import StrategyTemplateSerializer, UserStrategySerializer, StrategyLegSerializer

class StrategyTemplateViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing strategy templates
    """
    queryset = StrategyTemplate.objects.all()
    serializer_class = StrategyTemplateSerializer

class UserStrategyViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user strategies
    """
    serializer_class = UserStrategySerializer
    
    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return UserStrategy.objects.none()
        return UserStrategy.objects.filter(user=self.request.user)
    
    @swagger_auto_schema(
        method='get',
        responses={
            200: openapi.Response('Payoff data', openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'price': openapi.Schema(type=openapi.TYPE_NUMBER),
                        'payoff': openapi.Schema(type=openapi.TYPE_NUMBER),
                    }
                )
            ))
        }
    )
    @action(detail=True, methods=['get'])
    def payoff(self, request, pk=None):
        strategy = self.get_object()
        legs = strategy.legs.all()
        
        # Simple payoff calculation
        price_range = np.linspace(50, 150, 100)
        payoffs = []
        
        for price in price_range:
            total_payoff = 0
            for leg in legs:
                if leg.option_type == 'CALL':
                    intrinsic = max(0, price - float(leg.strike_price))
                else:
                    intrinsic = max(0, float(leg.strike_price) - price)
                
                if leg.leg_type == 'BUY':
                    payoff = intrinsic - float(leg.premium)
                else:
                    payoff = float(leg.premium) - intrinsic
                
                total_payoff += payoff * leg.quantity
            
            payoffs.append({'price': price, 'payoff': total_payoff})
        
        return Response(payoffs)

class StrategyLegViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing strategy legs
    """
    queryset = StrategyLeg.objects.all()
    serializer_class = StrategyLegSerializer