from django.db import models
from django.contrib.auth import get_user_model
from apps.options.models import Stock

User = get_user_model()

class Alert(models.Model):
    ALERT_TYPES = [
        ('PRICE', 'Price'),
        ('IV', 'Implied Volatility'),
        ('VOLUME', 'Volume')
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    alert_type = models.CharField(max_length=50, choices=ALERT_TYPES)
    condition = models.TextField()
    triggered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)