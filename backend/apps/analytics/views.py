from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count
from drf_yasg.utils import swagger_auto_schema
from .models import FlowData, MarketNews
from .serializers import FlowDataSerializer, MarketNewsSerializer

class FlowDataViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing options flow data
    """
    queryset = FlowData.objects.all()
    serializer_class = FlowDataSerializer
    
    @swagger_auto_schema(
        method='get',
        responses={200: FlowDataSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def unusual_activity(self, request):
        # Simple unusual activity detection
        high_volume = FlowData.objects.filter(
            volume__gt=1000
        ).order_by('-volume')[:20]
        
        serializer = self.get_serializer(high_volume, many=True)
        return Response(serializer.data)

class MarketNewsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing market news
    """
    queryset = MarketNews.objects.all()
    serializer_class = MarketNewsSerializer