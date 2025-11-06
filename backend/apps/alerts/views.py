from rest_framework import viewsets
from .models import Alert
from .serializers import AlertSerializer

class AlertViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user alerts
    """
    serializer_class = AlertSerializer
    
    def get_queryset(self):
        return Alert.objects.filter(user=self.request.user)