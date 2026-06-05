import yfinance as yf
import psycopg2
from datetime import datetime

# Database connection
conn = psycopg2.connect(
    host="localhost",
    port="5433",
    database="smartoptions",
    user="postgres",
    password="Syntel@01"
)
cur = conn.cursor()

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
        
        cur.execute("""
            INSERT INTO dev.stocks (symbol, company_name, exchange, sector, last_price, volume, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (symbol) DO UPDATE SET
                company_name = EXCLUDED.company_name,
                last_price = EXCLUDED.last_price,
                volume = EXCLUDED.volume,
                updated_at = EXCLUDED.updated_at
        """, (symbol, company_name, exchange, sector, float(last_price), int(volume), datetime.now()))
        
        print(f"Updated {symbol}: ${last_price:.2f}")
        
    except Exception as e:
        print(f"Error updating {symbol}: {e}")

conn.commit()
cur.close()
conn.close()
print("Stock data updated successfully!")