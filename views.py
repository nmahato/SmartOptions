from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import StockSerializer


class StockBulkAddView(APIView):
    """
    API view to handle bulk creation of stocks.
    """
    def post(self, request, *args, **kwargs):
        # The serializer expects a list of stock objects
        serializer = StockSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)