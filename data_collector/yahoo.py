import yfinance as yf
import pandas as pd
import os

def fetch_yahoo(symbol, start, end, interval="1d"):
    """
    Fetch historical data from Yahoo Finance.
    Use for: Long-term historical data, Model training.
    """
    print(f"Fetching Yahoo Finance data for {symbol}...")
    df = yf.download(symbol, start=start, end=end, interval=interval)
    
    if not df.empty:
        # Create data directory if it doesn't exist
        os.makedirs("data", exist_ok=True)
        filename = f"data/{symbol}_yahoo.csv"
        df.to_csv(filename)
        print(f"Data saved to {filename}")
    else:
        print(f"No data found for {symbol}")
        
    return df

if __name__ == "__main__":
    # Test with Apple stock
    fetch_yahoo("AAPL", start="2020-01-01", end="2025-01-01")
