import yfinance as yf
import pandas as pd
import numpy as np
import os
import joblib
from ml_engine.indicators import add_indicators
from ml_engine.prepare_dataset import prepare_data_for_lstm
from ml_engine.train_lstm import train_model

def auto_train(symbols=["AAPL", "TSLA", "MSFT", "NVDA", "BTC-USD"]):
    print(f"--- Bulk Training Pipeline Started for {len(symbols)} symbols ---")
    
    for symbol in symbols:
        print(f"\n[Training {symbol}]")
        try:
            # 1. Fetch Data
            df = yf.download(symbol, start="2020-01-01", interval="1d")
            if df.empty:
                print(f"Failed to fetch data for {symbol}.")
                continue
            
            # 2. Add Indicators
            df = add_indicators(df)
            
            # 3. Prepare Dataset
            X_train, X_test, y_train, y_test, scaler = prepare_data_for_lstm(df)
            
            # Save scaler
            os.makedirs("models", exist_ok=True)
            joblib.dump(scaler, f"models/{symbol}_scaler.gz")
            
            # 4. Train Model
            print(f"Training LSTM for {symbol}...")
            model, history = train_model(X_train, y_train, X_test, y_test, epochs=5) # 5 epochs for speed in bulk
            
            # Save symbol-specific model
            model.save(f"models/{symbol}_lstm_model.h5")
            print(f"Model saved to models/{symbol}_lstm_model.h5")
            
        except Exception as e:
            print(f"Error training {symbol}: {e}")

    print("\n--- Bulk Pipeline Completed Successfully ---")

if __name__ == "__main__":
    auto_train()

