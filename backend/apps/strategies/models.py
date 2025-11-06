from django.db import models
from django.contrib.auth import get_user_model
from apps.options.models import Stock

User = get_user_model()

class StrategyTemplate(models.Model):
    RISK_LEVELS = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High')
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, blank=True)
    risk_level = models.CharField(max_length=20, choices=RISK_LEVELS)
    max_profit = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    max_loss = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    breakeven_points = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class UserStrategy(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, null=True)
    strategy_template = models.ForeignKey(StrategyTemplate, on_delete=models.SET_NULL, null=True)
    custom_leg_count = models.IntegerField(default=0)
    expected_profit = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    expected_loss = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class StrategyLeg(models.Model):
    LEG_TYPES = [('BUY', 'Buy'), ('SELL', 'Sell')]
    OPTION_TYPES = [('CALL', 'Call'), ('PUT', 'Put')]
    
    user_strategy = models.ForeignKey(UserStrategy, on_delete=models.CASCADE, related_name='legs')
    leg_type = models.CharField(max_length=20, choices=LEG_TYPES)
    option_type = models.CharField(max_length=10, choices=OPTION_TYPES)
    strike_price = models.DecimalField(max_digits=10, decimal_places=2)
    expiry_date = models.DateField()
    quantity = models.IntegerField()
    premium = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)