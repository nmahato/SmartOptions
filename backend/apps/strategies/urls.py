from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'templates', views.StrategyTemplateViewSet)
router.register(r'user-strategies', views.UserStrategyViewSet, basename='userstrategy')
router.register(r'legs', views.StrategyLegViewSet)

urlpatterns = [
    path('', include(router.urls)),
]