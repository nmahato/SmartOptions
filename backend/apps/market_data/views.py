from rest_framework import generics
from .models import Stock
from .serializers import StockSerializer


class StockListCreateView(generics.ListCreateAPIView):
    """
    API view to retrieve a list of stocks or create a new stock.
    """
    queryset = Stock.objects.all()
    serializer_class = StockSerializer