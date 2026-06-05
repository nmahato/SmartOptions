from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Stock

@api_view(['GET'])
def get_stocks(request):
    """Get all stocks from database"""
    stocks = Stock.objects.order_by('symbol').values('symbol', 'company_name', 'last_price')
    return Response([
        {
            'symbol': stock['symbol'],
            'company_name': stock['company_name'],
            'last_price': float(stock['last_price']) if stock['last_price'] else 0,
        }
        for stock in stocks
    ])
