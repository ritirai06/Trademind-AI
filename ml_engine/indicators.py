import pandas as pd
import numpy as np

def add_indicators(df):
    """
    Add technical indicators to a pandas DataFrame containing OHLC data.
    - RSI
    - EMA 20/50
    - MACD
    - Bollinger Bands
    - Volatility
    """
    # Use close price for most indicators
    close = df['Close']
    
    # 1. EMA (Exponential Moving Average)
    df['EMA_20'] = close.ewm(span=20, adjust=False).mean()
    df['EMA_50'] = close.ewm(span=50, adjust=False).mean()
    
    # 2. RSI (Relative Strength Index)
    delta = close.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    df['RSI'] = 100 - (100 / (1 + rs))
    
    # 3. MACD (Moving Average Convergence Divergence)
    exp1 = close.ewm(span=12, adjust=False).mean()
    exp2 = close.ewm(span=26, adjust=False).mean()
    df['MACD'] = exp1 - exp2
    df['MACD_Signal'] = df['MACD'].ewm(span=9, adjust=False).mean()
    
    # 4. Bollinger Bands
    df['MA_20'] = close.rolling(window=20).mean()
    df['BB_Std'] = close.rolling(window=20).std()
    df['BB_Upper'] = df['MA_20'] + (df['BB_Std'] * 2)
    df['BB_Lower'] = df['MA_20'] - (df['BB_Std'] * 2)
    
    # 5. Volatility (Log returns rolling std)
    df['Log_Returns'] = np.log(close / close.shift(1))
    df['Volatility'] = df['Log_Returns'].rolling(window=21).std() * np.sqrt(252) # Annualized
    
    return df.dropna()

if __name__ == "__main__":
    print("Indicators module loaded.")
