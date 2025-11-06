from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Stock, OptionsChain
from .serializers import StockSerializer, OptionsChainSerializer

class StockViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing stocks data
    """
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

class OptionsChainViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing options chain data
    """
    queryset = OptionsChain.objects.all()
    serializer_class = OptionsChainSerializer
    
    @swagger_auto_schema(
        method='get',
        manual_parameters=[
            openapi.Parameter('symbol', openapi.IN_QUERY, description="Stock symbol", type=openapi.TYPE_STRING, required=True)
        ],
        responses={200: OptionsChainSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def by_symbol(self, request):
        symbol = request.query_params.get('symbol')
        if symbol:
            options = self.queryset.filter(stock__symbol=symbol)
            serializer = self.get_serializer(options, many=True)
            return Response(serializer.data)
        return Response({'error': 'Symbol parameter required'})