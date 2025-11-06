from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'flow', views.FlowDataViewSet)
router.register(r'news', views.MarketNewsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]