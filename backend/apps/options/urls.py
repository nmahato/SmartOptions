from django.urls import path
from . import views

urlpatterns = [
    path('stocks-list/', views.get_stocks, name='get_stocks'),
]