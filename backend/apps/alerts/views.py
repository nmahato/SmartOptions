from rest_framework import viewsets
from .models import Alert
from .serializers import AlertSerializer

class AlertViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user alerts
    """
    serializer_class = AlertSerializer
    
    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Alert.objects.none()
        return Alert.objects.filter(user=self.request.user)