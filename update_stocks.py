import yfinance as yf
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "smartoptions.settings")

import django

django.setup()

from apps.options.models import Stock

# Stock symbols
symbols = ['AAPL', 'TSLA', 'SPY', 'QQQ', 'MSFT', 'GOOGL']

for symbol in symbols:
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        hist = ticker.history(period="1d")
        
        company_name = info.get('longName', symbol)
        exchange = info.get('exchange', 'NASDAQ')
        sector = info.get('sector', 'Unknown')
        last_price = hist['Close'].iloc[-1] if not hist.empty else 0
        volume = hist['Volume'].iloc[-1] if not hist.empty else 0
        
        Stock.objects.update_or_create(
            symbol=symbol,
            defaults={
                "company_name": company_name,
                "exchange": exchange,
                "sector": sector,
                "last_price": float(last_price),
                "volume": int(volume),
            },
        )
        
        print(f"Updated {symbol}: ${last_price:.2f}")
        
    except Exception as e:
        print(f"Error updating {symbol}: {e}")

print("Stock data updated successfully!")
