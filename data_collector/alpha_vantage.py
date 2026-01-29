import requests
import os
from dotenv import load_dotenv

load_dotenv()

def fetch_alpha(symbol):
    """
    Fetch daily time series from Alpha Vantage.
    Use for: Cross-checking, Extra markets, Free indicators.
    """
    print(f"Fetching Alpha Vantage data for {symbol}...")
    url = "https://www.alphavantage.co/query"
    params = {
        "function": "TIME_SERIES_DAILY",
        "symbol": symbol,
        "apikey": os.getenv("ALPHA_KEY"),
        "outputsize": "full"
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    if "Error Message" in data:
        print(f"Error fetching data: {data['Error Message']}")
    elif "Note" in data:
        print(f"API Limit reached: {data['Note']}")
        
    return data

if __name__ == "__main__":
    # Test with IBM (common test symbol)
    res = fetch_alpha("IBM")
    print(res.keys())
    if "Time Series (Daily)" in res:
        print(f"Successfully fetched {len(res['Time Series (Daily)'])} days of data.")
