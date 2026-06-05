from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import connection

@api_view(['GET'])
def get_stocks(request):
    """Get all stocks from database"""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT symbol, company_name, last_price FROM dev.stocks ORDER BY symbol")
            stocks = cursor.fetchall()
            
        stock_list = [
            {
                'symbol': stock[0],
                'company_name': stock[1],
                'last_price': float(stock[2]) if stock[2] else 0
            }
            for stock in stocks
        ]
        
        return Response(stock_list)
        
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )