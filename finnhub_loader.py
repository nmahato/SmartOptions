import requests
import os
import sys
from datetime import datetime
import time
from decouple import config

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "smartoptions.settings")

import django

django.setup()

from apps.options.models import Stock

# Finnhub API configuration
API_KEY = config("FINNHUB_API_KEY", default="")
BASE_URL = "https://finnhub.io/api/v1"

def get_stock_quote(symbol):
    """Get real-time stock quote from Finnhub"""
    url = f"{BASE_URL}/quote"
    params = {"symbol": symbol, "token": API_KEY}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching {symbol}: {e}")
        return None

def get_company_profile(symbol):
    """Get company profile from Finnhub"""
    url = f"{BASE_URL}/stock/profile2"
    params = {"symbol": symbol, "token": API_KEY}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching profile for {symbol}: {e}")
        return None

def load_stock_data(symbols):
    """Load stock data from Finnhub API"""
    print(f"Loading {len(symbols)} stocks from Finnhub...")
    
    for i, symbol in enumerate(symbols):
        try:
            # Get quote data
            quote = get_stock_quote(symbol)
            if not quote or quote.get('c') is None:
                continue
                
            # Get company profile
            profile = get_company_profile(symbol)
            
            company_name = profile.get('name', symbol) if profile else symbol
            exchange = profile.get('exchange', 'NASDAQ') if profile else 'NASDAQ'
            sector = profile.get('finnhubIndustry', 'Unknown') if profile else 'Unknown'
            last_price = float(quote['c'])  # Current price
            volume = int(quote.get('v', 0))  # Volume
            
            Stock.objects.update_or_create(
                symbol=symbol,
                defaults={
                    "company_name": company_name,
                    "exchange": exchange,
                    "sector": sector,
                    "last_price": last_price,
                    "volume": volume,
                },
            )
            
            print(f"Updated {symbol}: ${last_price:.2f}")
            
            # Rate limiting (60 calls/minute for free tier)
            time.sleep(1)
            
        except Exception as e:
            print(f"Error processing {symbol}: {e}")
            continue
    
    print("Stock data loading complete!")

if __name__ == "__main__":
    # Popular stocks to load
    symbols = [
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
        'AMD', 'INTC', 'CRM', 'ORCL', 'ADBE', 'PYPL', 'DIS', 'BA',
        'JPM', 'GS', 'V', 'MA', 'WMT', 'HD', 'PG', 'JNJ', 'SPY', 'QQQ'
    ]
    
    if not API_KEY or API_KEY == "your_finnhub_api_key":
        print("Please set your Finnhub API key in the script")
        print("Get a free key at: https://finnhub.io/register")
    else:
        load_stock_data(symbols)
