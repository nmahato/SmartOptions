import yfinance as yf
import psycopg2
from datetime import datetime
from decouple import config

# Popular stocks list
stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'SPY', 'QQQ', 
          'AMD', 'INTC', 'CRM', 'ORCL', 'ADBE', 'PYPL', 'DIS', 'BA', 'JPM', 'GS',
          'V', 'MA', 'WMT', 'HD', 'PG', 'JNJ', 'UNH', 'VZ', 'T', 'KO',
          'PFE', 'MRK', 'XOM', 'CVX', 'BAC', 'WFC', 'C', 'GE', 'IBM', 'CSCO']

# Database connection
conn = psycopg2.connect(
    host=config("DB_HOST", default="localhost"),
    port=config("DB_PORT", default="5432"),
    database=config("DB_NAME", default="smartoptions"),
    user=config("DB_USER", default="postgres"),
    password=config("DB_PASSWORD", default="")
)
cur = conn.cursor()

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
        
        if i % 10 == 0:
            conn.commit()
            print(f"Processed {i+1}/{len(stocks)} stocks...")
            
    except Exception as e:
        print(f"Error with {symbol}: {e}")
        continue

conn.commit()
cur.close()
conn.close()
print("Stock loading complete!")
