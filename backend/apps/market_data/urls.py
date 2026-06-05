from django.urls import path
from .views import StockListCreateView

urlpatterns = [
    path('stocks/', StockListCreateView.as_view(), name='stock-list-create'),
]