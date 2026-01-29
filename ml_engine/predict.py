import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model

def predict_next_price(model, last_window, scaler):
    """
    Predict the next close price.
    last_window: (window_size, num_features)
    """
    # Reshape for model input (1, window_size, num_features)
    num_features = last_window.shape[1]
    last_window_reshaped = np.expand_dims(last_window, axis=0)
    
    prediction_scaled = model.predict(last_window_reshaped)
    
    # Inverse transform to get actual price
    # Need to create a placeholder to inverse scale properly if multiple features were used
    placeholder = np.zeros((1, num_features))
    placeholder[0, 0] = prediction_scaled[0, 0] # Assume Close is at index 0
    
    actual_prediction = scaler.inverse_transform(placeholder)[0, 0]
    return actual_prediction

def predict_high_low(model, last_window, scaler, n_steps=5):
    """
    Predict potential high and low for next N steps.
    """
    predictions = []
    current_window = last_window.copy()
    
    for _ in range(n_steps):
        # Predict next
        pred_scaled = model.predict(np.expand_dims(current_window, axis=0))
        predictions.append(pred_scaled[0, 0])
        
        # Update window (rolling)
        new_row = current_window[-1].copy()
        new_row[0] = pred_scaled[0, 0] # Update 'Close' with prediction
        
        current_window = np.append(current_window[1:], [new_row], axis=0)
        
    # Convert back to actual prices
    num_features = last_window.shape[1]
    actual_prices = []
    for p in predictions:
        placeholder = np.zeros((1, num_features))
        placeholder[0, 0] = p
        actual_prices.append(scaler.inverse_transform(placeholder)[0, 0])
        
    return {
        "expected_high": max(actual_prices),
        "expected_low": min(actual_prices),
        "all_predictions": actual_prices
    }

if __name__ == "__main__":
    print("Prediction engine ready.")
