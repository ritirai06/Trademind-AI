import requests
import pandas as pd
from datetime import datetime

def fetch_crypto(coin="bitcoin", days=365):
    """
    Fetch crypto market chart data from CoinGecko.
    Use for: Crypto ML training, Volatility modeling.
    """
    print(f"Fetching CoinGecko data for {coin}...")
    url = f"https://api.coingecko.com/api/v3/coins/{coin}/market_chart"
    params = {"vs_currency": "usd", "days": days}
    
    response = requests.get(url, params=params)
    data = response.json()
    
    if "prices" in data:
        prices = data["prices"]
        df = pd.DataFrame(prices, columns=["timestamp", "price"])
        df["date"] = pd.to_datetime(df["timestamp"], unit="ms")
        df.set_index("date", inplace=True)
        print(f"Successfully fetched {len(df)} price points.")
        return df
    else:
        print(f"Error: {data}")
        return pd.DataFrame()

if __name__ == "__main__":
    # Test with Bitcoin
    df = fetch_crypto("bitcoin", days=30)
    print(df.head())
