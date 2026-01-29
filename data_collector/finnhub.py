import finnhub
import os
from dotenv import load_dotenv

load_dotenv()

def get_finnhub_client():
    api_key = os.getenv("FINNHUB_KEY")
    if not api_key:
        print("Warning: FINNHUB_KEY not found in .env")
        return None
    return finnhub.Client(api_key=api_key)

def fetch_realtime_quote(symbol):
    """
    Fetch real-time stock quote from Finnhub.
    Use for: Live dashboard, Real-time prediction.
    """
    client = get_finnhub_client()
    if client:
        print(f"Fetching real-time quote for {symbol}...")
        return client.quote(symbol)
    return {}

def fetch_market_news(category="general"):
    """
    Fetch global market news from Finnhub.
    """
    client = get_finnhub_client()
    if client:
        print(f"Fetching market news for {category}...")
        return client.general_news(category, min_id=0)
    return []

if __name__ == "__main__":
    quote = fetch_realtime_quote("AAPL")
    print(f"Real-time Quote for AAPL: {quote}")
