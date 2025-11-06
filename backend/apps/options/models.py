from django.db import models

class Stock(models.Model):
    symbol = models.CharField(max_length=10, unique=True)
    company_name = models.CharField(max_length=150, blank=True)
    exchange = models.CharField(max_length=50, blank=True)
    sector = models.CharField(max_length=100, blank=True)
    last_price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    volume = models.BigIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

class OptionsChain(models.Model):
    OPTION_TYPES = [('CALL', 'Call'), ('PUT', 'Put')]
    
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    option_type = models.CharField(max_length=10, choices=OPTION_TYPES)
    strike_price = models.DecimalField(max_digits=10, decimal_places=2)
    expiry_date = models.DateField()
    last_price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    bid = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    ask = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    implied_volatility = models.DecimalField(max_digits=6, decimal_places=3, null=True)
    delta = models.DecimalField(max_digits=6, decimal_places=3, null=True)
    gamma = models.DecimalField(max_digits=6, decimal_places=3, null=True)
    theta = models.DecimalField(max_digits=6, decimal_places=3, null=True)
    vega = models.DecimalField(max_digits=6, decimal_places=3, null=True)
    rho = models.DecimalField(max_digits=6, decimal_places=3, null=True)
    open_interest = models.BigIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)