import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split

def prepare_data_for_lstm(df, target_col='Close', window_size=60, test_size=0.2):
    """
    Prepare dataset for LSTM training using sliding window.
    """
    # 1. Scaling the data
    scaler = MinMaxScaler(feature_range=(0, 1))
    # Using multiple features: Close, RSI, EMA_20, EMA_50, MACD, Volatility
    features = ['Close', 'RSI', 'EMA_20', 'EMA_50', 'MACD', 'Volatility']
    data_scaled = scaler.fit_transform(df[features])
    
    X = []
    y = []
    
    # Target index for 'Close' is 0
    target_idx = 0 
    
    # 2. Sliding window
    for i in range(window_size, len(data_scaled)):
        X.append(data_scaled[i-window_size:i])
        y.append(data_scaled[i, target_idx]) # Predict next Close
        
    X, y = np.array(X), np.array(y)
    
    # 3. Train/Test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, shuffle=False)
    
    return X_train, X_test, y_train, y_test, scaler

if __name__ == "__main__":
    print("Dataset builder ready. (Needs real dataframe to test)")
