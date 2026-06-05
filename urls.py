from django.urls import path
from .views import StockBulkAddView

urlpatterns = [
    # Endpoint for adding multiple stocks at once
    path('stocks/bulk-add/', StockBulkAddView.as_view(), name='stock-bulk-add'),
]
