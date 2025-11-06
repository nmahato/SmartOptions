from django.db import models

class FlowData(models.Model):
    symbol = models.CharField(max_length=10)
    volume = models.BigIntegerField()
    trade_date = models.DateTimeField()
    option_type = models.CharField(max_length=10)
    strike_price = models.DecimalField(max_digits=10, decimal_places=2)
    expiry_date = models.DateField()
    premium = models.DecimalField(max_digits=10, decimal_places=2)
    
class MarketNews(models.Model):
    stock_symbol = models.CharField(max_length=10, blank=True)
    headline = models.TextField()
    source = models.CharField(max_length=100)
    published_at = models.DateTimeField()
    url = models.URLField(blank=True)