from django.contrib import admin
from .models import StrategyTemplate, UserStrategy, StrategyLeg

admin.site.register(StrategyTemplate)
admin.site.register(UserStrategy)
admin.site.register(StrategyLeg)