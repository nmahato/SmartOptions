import requests
import psycopg2
from datetime import datetime
import time

# Finnhub API configuration
API_KEY = "d46ci01r01qgc9es6aggd46ci01r01qgc9es6ah0"  # Get free key from https://finnhub.io/
BASE_URL = "https://finnhub.io/api/v1"

# Database connection
conn = psycopg2.connect(
    host="localhost",
    port="5433",
    database="smartoptions", 
    user="postgres",
    password="Syntel@01"
)
cur = conn.cursor()

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
            
            # Insert/update database
            cur.execute("""
                INSERT INTO dev.stocks (symbol, company_name, exchange, sector, last_price, volume, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (symbol) DO UPDATE SET
                    company_name = EXCLUDED.company_name,
                    exchange = EXCLUDED.exchange,
                    sector = EXCLUDED.sector,
                    last_price = EXCLUDED.last_price,
                    volume = EXCLUDED.volume,
                    updated_at = EXCLUDED.updated_at
            """, (symbol, company_name, exchange, sector, last_price, volume, datetime.now()))
            
            print(f"Updated {symbol}: ${last_price:.2f}")
            
            # Rate limiting (60 calls/minute for free tier)
            time.sleep(1)
            
            if i % 10 == 0:
                conn.commit()
                
        except Exception as e:
            print(f"Error processing {symbol}: {e}")
            continue
    
    conn.commit()
    print("Stock data loading complete!")

if __name__ == "__main__":
    # Popular stocks to load
    symbols = [
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
        'AMD', 'INTC', 'CRM', 'ORCL', 'ADBE', 'PYPL', 'DIS', 'BA',
        'JPM', 'GS', 'V', 'MA', 'WMT', 'HD', 'PG', 'JNJ', 'SPY', 'QQQ'
    ]
    
    if API_KEY == "your_finnhub_api_key":
        print("Please set your Finnhub API key in the script")
        print("Get a free key at: https://finnhub.io/register")
    else:
        load_stock_data(symbols)
    
    cur.close()
    conn.close()