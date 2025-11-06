from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'stocks', views.StockViewSet)
router.register(r'chains', views.OptionsChainViewSet)

urlpatterns = [
    path('', include(router.urls)),
]