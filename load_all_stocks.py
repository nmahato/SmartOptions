import yfinance as yf
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "smartoptions.settings")

import django

django.setup()

from apps.options.models import Stock

# Popular stocks list
stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'SPY', 'QQQ', 
          'AMD', 'INTC', 'CRM', 'ORCL', 'ADBE', 'PYPL', 'DIS', 'BA', 'JPM', 'GS',
          'V', 'MA', 'WMT', 'HD', 'PG', 'JNJ', 'UNH', 'VZ', 'T', 'KO',
          'PFE', 'MRK', 'XOM', 'CVX', 'BAC', 'WFC', 'C', 'GE', 'IBM', 'CSCO']

print(f"Loading {len(stocks)} popular stocks...")

for i, symbol in enumerate(stocks):
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        hist = ticker.history(period="1d")
        
        if hist.empty:
            continue
            
        company_name = info.get('longName', symbol)
        exchange = info.get('exchange', 'NYSE')
        sector = info.get('sector', 'Unknown')
        last_price = float(hist['Close'].iloc[-1])
        volume = int(hist['Volume'].iloc[-1])
        
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
        
        if i % 10 == 0:
            print(f"Processed {i+1}/{len(stocks)} stocks...")
            
    except Exception as e:
        print(f"Error with {symbol}: {e}")
        continue

print("Stock loading complete!")
