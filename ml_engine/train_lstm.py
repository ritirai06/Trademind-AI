import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import os

def build_lstm_model(input_shape):
    """
    Define LSTM model architecture.
    """
    model = Sequential([
        LSTM(units=50, return_sequences=True, input_shape=input_shape),
        Dropout(0.2),
        LSTM(units=50, return_sequences=False),
        Dropout(0.2),
        Dense(units=25),
        Dense(units=1)
    ])
    
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

def train_model(X_train, y_train, X_test, y_test, epochs=20, batch_size=32):
    """
    Train the LSTM model and save it.
    """
    model = build_lstm_model((X_train.shape[1], X_train.shape[2]))
    
    print("Starting training...")
    history = model.fit(
        X_train, y_train, 
        epochs=epochs, 
        batch_size=batch_size, 
        validation_data=(X_test, y_test),
        verbose=1
    )
    
    # Save model
    os.makedirs("models", exist_ok=True)
    model.save("models/lstm_model.h5")
    print("Model saved to models/lstm_model.h5")
    
    return model, history

if __name__ == "__main__":
    print("LSTM Training engine ready.")
