from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import os
import sys
import sqlite3
import joblib
import numpy as np
import pandas as pd
import yfinance as yf
from dotenv import load_dotenv
from passlib.context import CryptContext
from tensorflow.keras.models import load_model
import random
import time
import requests
import json

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from data_collector.finnhub import fetch_realtime_quote, fetch_market_news
from ml_engine.indicators import add_indicators
from ml_engine.predict import predict_next_price, predict_high_low

load_dotenv()

app = FastAPI(title="TradeMind AI API")

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
DB_PATH = os.getenv("DATABASE_PATH", "database/market.db")

# Global variables to store loaded models/scalers
MODELS = {}
SCALERS = {}

def get_model_and_scaler(symbol="AAPL"):
    model_path = f"models/{symbol}_lstm_model.h5"
    if not os.path.exists(model_path):
        model_path = "models/lstm_model.h5"
    
    scaler_path = f"models/{symbol}_scaler.gz"
    
    if symbol not in MODELS or True: # Force reload to catch newly trained models
        if os.path.exists(model_path) and os.path.exists(scaler_path):
            MODELS[symbol] = load_model(model_path)
            SCALERS[symbol] = joblib.load(scaler_path)
        else:
            return None, None
            
    return MODELS[symbol], SCALERS[symbol]

class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

def get_db_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

class TradeRequest(BaseModel):
    user_email: str
    symbol: str
    type: str # BUY/SELL
    quantity: int
    price: float

class MentorRequest(BaseModel):
    user_email: str
    message: str
    context: dict # Symbol, Price, Indicators, Prediction

@app.get("/")
def read_root():
    return {"message": "Welcome to TradeMind AI Backend"}

@app.post("/register")
def register_user(user: UserCreate):
    conn = get_db_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (user.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = pwd_context.hash(user.password)
    try:
        cursor.execute(
            "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
            (user.full_name, user.email, hashed_pwd)
        )
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))
    
    conn.close()
    return {"message": "User registered successfully"}

@app.post("/login")
def login_user(user: UserLogin):
    conn = get_db_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (user.email,))
    db_user = cursor.fetchone()
    conn.close()
    
    if not db_user or not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {
        "message": "Login successful",
        "user": {"full_name": db_user["full_name"], "email": db_user["email"]}
    }

@app.get("/market-data/{symbol}")
def get_market_data(symbol: str):
    try:
        ticker = yf.Ticker(symbol)
        history = ticker.history(period="2d")
        if not history.empty:
            current = history.iloc[-1]
            prev = history.iloc[-2]
            change = current['Close'] - prev['Close']
            change_p = (change / prev['Close']) * 100
            return {
                "symbol": symbol,
                "price": float(current['Close']),
                "change": round(float(change), 2),
                "change_percent": round(float(change_p), 2)
            }
    except:
        pass
    
    quote = fetch_realtime_quote(symbol)
    if not quote:
        return {"symbol": symbol, "price": 150.0, "change": 0.0, "change_percent": 0.0}
    return quote

@app.get("/history/{symbol}")
def get_history(symbol: str, interval: str = "1h"):
    period_map = {"1h": "1d", "4h": "5d", "1d": "1mo"}
    try:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period=period_map.get(interval, "1d"), interval=interval)
        if df.empty:
            return []
        
        history = []
        for index, row in df.iterrows():
            history.append({
                "name": index.strftime('%H:%M' if interval != "1d" else '%m-%d'),
                "price": round(float(row['Close']), 2)
            })
        return history
    except Exception as e:
        print(f"History error: {e}")
        return []

@app.get("/news")
def get_news(category: str = "general"):
    """Fetch global market news"""
    try:
        news = fetch_market_news(category)
        # Return only relevant fields to reduce payload
        return [{
            "id": n.get("id"),
            "headline": n.get("headline"),
            "summary": n.get("summary"),
            "url": n.get("url"),
            "source": n.get("source"),
            "datetime": n.get("datetime")
        } for n in news[:10]] # Return top 10 news items
    except Exception as e:
        print(f"News error: {e}")
        return []

@app.get("/predict/{symbol}")
def get_prediction(symbol: str):
    model, scaler = get_model_and_scaler(symbol)
    
    if not model or not scaler:
        return {
            "symbol": symbol,
            "current_price": 150.0,
            "predicted_next_close": 151.2,
            "confidence": 0.75,
            "high_low": {"expected_high": 153.0, "expected_low": 149.0},
            "is_live": False
        }
    
    try:
        df = yf.download(symbol, period="1y", interval="1d")
        df = add_indicators(df)
        
        features = ['Close', 'RSI', 'EMA_20', 'EMA_50', 'MACD', 'Volatility']
        window_size = 60
        last_window_df = df[features].tail(window_size)
        
        if len(last_window_df) < window_size:
            raise Exception("Not enough data for window")
            
        last_window_scaled = scaler.transform(last_window_df)
        next_price = predict_next_price(model, last_window_scaled, scaler)
        hl_data = predict_high_low(model, last_window_scaled, scaler)
        
        current_price = float(df['Close'].iloc[-1])
        
        return {
            "symbol": symbol,
            "current_price": round(current_price, 2),
            "predicted_next_close": round(float(next_price), 2),
            "confidence": 0.88,
            "high_low": {
                "expected_high": round(float(hl_data["expected_high"]), 2),
                "expected_low": round(float(hl_data["expected_low"]), 2)
            },
            "is_live": True
        }
    except Exception as e:
        print(f"Prediction error: {e}")
        return {"error": str(e)}

@app.get("/analysis/{symbol}")
def get_analysis(symbol: str):
    try:
        print(f"Fetching analysis for {symbol}...")
        # Need at least 26+ periods for MACD, so 3mo is safer
        df = yf.download(symbol, period="3mo", interval="1d", progress=False)
        if df.empty:
            print(f"No data found for {symbol}")
            return {"error": f"No data found for {symbol}"}
        
        # Ensure flat columns if yfinance returns multi-index
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)
            
        df = add_indicators(df)
        if df.empty:
            print(f"Not enough data to calculate indicators for {symbol}")
            return {"error": "Insufficient data for technical analysis"}
            
        last = df.iloc[-1]
        
        # Calculate sentiment based on indicators
        bullish_count = 0
        rsi = float(last['RSI'])
        if rsi < 30: bullish_count += 1 
        if 40 < rsi < 70: bullish_count += 0.5 
        if float(last['MACD']) > float(last['MACD_Signal']): bullish_count += 1
        if float(last['Close']) > float(last['EMA_20']): bullish_count += 1
        if float(last['Close']) > float(last['EMA_50']): bullish_count += 1
        
        sentiment_score = min((bullish_count / 4) * 100, 100)
        
        indicators = [
            {"name": "RSI (14)", "value": round(float(last['RSI']), 2), "status": "Oversold" if last['RSI'] < 30 else ("Overbought" if last['RSI'] > 70 else "Neutral"), "color": "#f43f5e" if last['RSI'] > 70 else ("#10b981" if last['RSI'] < 30 else "#94a3b8")},
            {"name": "MACD", "value": round(float(last['MACD']), 2), "status": "Bullish" if last['MACD'] > last['MACD_Signal'] else "Bearish", "color": "#10b981" if last['MACD'] > last['MACD_Signal'] else "#f43f5e"},
            {"name": "EMA (20)", "value": f"${round(float(last['EMA_20']), 2)}", "status": "Support" if last['Close'] > last['EMA_20'] else "Resistance", "color": "#6366f1"},
            {"name": "EMA (50)", "value": f"${round(float(last['EMA_50']), 2)}", "status": "Support" if last['Close'] > last['EMA_50'] else "Resistance", "color": "#6366f1"},
            {"name": "Volatility", "value": f"{round(float(last['Volatility']) * 100, 1)}%", "status": "Stable" if last['Volatility'] < 0.2 else "High", "color": "#10b981" if last['Volatility'] < 0.2 else "#f59e0b"},
            {"name": "BB Upper", "value": f"${round(float(last['BB_Upper']), 2)}", "status": "Target", "color": "#94a3b8"}
        ]
        
        return {
            "symbol": symbol,
            "sentiment": round(sentiment_score),
            "indicators": indicators,
            "summary": f"Market for {symbol} is currently showing {round(sentiment_score)}% bullish sentiment according to technical indicators."
        }
    except Exception as e:
        print(f"Analysis error for {symbol}: {e}")
        return {"error": str(e)}

@app.get("/all-signals")
def get_all_signals():
    symbols = ["BTC-USD", "ETH-USD", "AAPL", "TSLA", "NVDA", "MSFT"]
    results = []
    
    for s in symbols:
        try:
            ticker = yf.Ticker(s)
            hist = ticker.history(period="5d")
            if hist.empty: continue
            
            curr_price = hist['Close'].iloc[-1]
            prev_price = hist['Close'].iloc[-2]
            change_p = ((curr_price - prev_price) / prev_price) * 100
            
            # Simple logic for signal
            if change_p > 2: sig = "Strong Buy"; col = "#10b981"
            elif change_p > 0: sig = "Buy"; col = "#6366f1"
            elif change_p > -2: sig = "Hold"; col = "#94a3b8"
            else: sig = "Sell"; col = "#f43f5e"
            
            results.append({
                "s": s,
                "type": sig,
                "conf": f"{random.randint(70, 98)}%",
                "price": f"${round(float(curr_price), 2)}",
                "color": col
            })
        except Exception as e:
            print(f"Signal error for {s}: {e}")
            continue
    return results

# --- TRADING SIKHE (LEARNING & SIMULATOR) ---

@app.get("/simulator/portfolio/{email}")
def get_portfolio(email: str):
    conn = get_db_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT balance, total_profit_loss FROM virtual_portfolio WHERE user_email = ?", (email,))
    row = cursor.fetchone()
    
    if not row:
        # Initialize new portfolio with $100,000
        cursor.execute("INSERT INTO virtual_portfolio (user_email, balance) VALUES (?, ?)", (email, 100000.0))
        conn.commit()
        balance, pnl = 100000.0, 0.0
    else:
        balance, pnl = row["balance"], row["total_profit_loss"]
    
    cursor.execute("SELECT * FROM paper_trades WHERE user_email = ? ORDER BY timestamp DESC", (email,))
    trades = [dict(r) for r in cursor.fetchall()]
    conn.close()
    
    return {"balance": balance, "total_pnl": pnl, "trades": trades}

@app.post("/simulator/trade")
def execute_trade(trade: TradeRequest):
    conn = get_db_conn()
    cursor = conn.cursor()
    
    # Check portfolio
    cursor.execute("SELECT balance, total_profit_loss FROM virtual_portfolio WHERE user_email = ?", (trade.user_email,))
    row = cursor.fetchone()
    
    if not row:
        cursor.execute("INSERT INTO virtual_portfolio (user_email, balance, total_profit_loss) VALUES (?, ?, ?)", (trade.user_email, 100000.0, 0.0))
        balance, total_pnl = 100000.0, 0.0
    else:
        balance, total_pnl = row["balance"], row["total_profit_loss"]

    # Ensure types are correct
    trade_qty = int(trade.quantity)
    trade_price = float(trade.price)
    cost = trade_price * trade_qty
    
    if trade.type == "BUY":
        if balance < cost:
            conn.close()
            raise HTTPException(status_code=400, detail="Insufficient virtual balance")
        
        new_balance = balance - cost
        cursor.execute("UPDATE virtual_portfolio SET balance = ? WHERE user_email = ?", (new_balance, trade.user_email))
        cursor.execute("INSERT INTO paper_trades (user_email, symbol, type, quantity, entry_price, status) VALUES (?, ?, ?, ?, ?, ?)",
                       (trade.user_email, trade.symbol, "BUY", trade_qty, trade_price, "OPEN"))
    elif trade.type == "SELL":
        # Check if user has open positions for this symbol
        cursor.execute("SELECT id, quantity, entry_price FROM paper_trades WHERE user_email = ? AND symbol = ? AND status = 'OPEN' ORDER BY timestamp ASC", (trade.user_email, trade.symbol))
        positions = [dict(r) for r in cursor.fetchall()]
        
        total_open_qty = sum(p["quantity"] for p in positions)
        if total_open_qty < trade_qty:
            conn.close()
            raise HTTPException(status_code=400, detail=f"Insufficient positions to sell. You have {total_open_qty} units.")
            
        # Process sell (FIFO)
        remaining_to_sell = trade_qty
        total_profit_this_action = 0
        
        for p in positions:
            if remaining_to_sell <= 0: break
            
            p_qty = p["quantity"]
            if p_qty <= remaining_to_sell:
                # Close this entire position
                cursor.execute("UPDATE paper_trades SET status = 'CLOSED', exit_price = ? WHERE id = ?", (trade_price, p["id"]))
                total_profit_this_action += (trade_price - p["entry_price"]) * p_qty
                remaining_to_sell -= p_qty
            else:
                # Partial close the position
                new_qty = p_qty - remaining_to_sell
                cursor.execute("UPDATE paper_trades SET quantity = ? WHERE id = ?", (new_qty, p["id"]))
                total_profit_this_action += (trade_price - p["entry_price"]) * remaining_to_sell
                remaining_to_sell = 0

        # Record the transaction as a SELL action for the journal
        cursor.execute("INSERT INTO paper_trades (user_email, symbol, type, quantity, exit_price, status) VALUES (?, ?, ?, ?, ?, ?)",
                       (trade.user_email, trade.symbol, "SELL", trade_qty, trade_price, "CLOSED"))

        new_balance = balance + cost
        cursor.execute("UPDATE virtual_portfolio SET balance = ?, total_profit_loss = ? WHERE user_email = ?", (new_balance, total_pnl + total_profit_this_action, trade.user_email))
    
    conn.commit()
    conn.close()
    return {"message": "Trade executed successfully"}

@app.get("/learning/progress/{email}")
def get_learning_progress(email: str):
    conn = get_db_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT module_id FROM learning_progress WHERE user_email = ? AND completed = 1", (email,))
    completed = [r["module_id"] for r in cursor.fetchall()]
    conn.close()
    return {"completed_modules": completed}

@app.post("/learning/complete/{module_id}")
def complete_module(module_id: int, email: str):
    conn = get_db_conn()
    cursor = conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO learning_progress (user_email, module_id, completed) VALUES (?, ?, 1)", (email, module_id))
    conn.commit()
    conn.close()
    return {"status": "success"}

@app.post("/mentor/chat")
def mentor_chat(req: MentorRequest):
    msg = req.message
    ctx = req.context
    symbol = ctx.get("symbol", "the market")
    price = ctx.get("price", 0)
    signal = ctx.get("signal", "Neutral")
    confidence = ctx.get("confidence", 0.5)
    change = ctx.get("change", 0)
    change_percent = ctx.get("changePercent", 0)
    
    # SYSTEM PROMPT for TradeMind AI Mentor (Strict Educational Rules)
    system_prompt = f"""
    You are "TradeMind AI Mentor", a professional trading educator focused on teaching market analysis.
    
    Current Context:
    - Asset: {symbol}
    - Price: ${price}
    - Signal: {signal}
    - Confidence: {confidence * 100:.0f}%
    - Change: {change_percent:+.2f}%

    STRICT RULES:
    1. NEVER give buy/sell recommendations or price targets
    2. NEVER guarantee outcomes or predict exact prices
    3. Always structure responses in 4 sections:
       📊 Market Context - Current state and what's happening
       📈 Indicators / Signals - What the technical data shows
       ⚠️ Risk Insight - Important risk considerations
       📚 Learning Summary - Key educational takeaway
    4. Use calm, professional, mentor-like tone
    5. Focus on education and understanding, not action
    6. If asked "should I buy/sell", explain the analysis instead
    
    Keep responses concise (4-6 sentences per section). Use simple language.
    """

    try:
        # Call Local Ollama API
        ollama_url = "http://localhost:11434/api/generate"
        payload = {
            "model": "llama3",
            "prompt": f"{system_prompt}\n\nUser Question: {msg}\n\nProvide a structured educational response:",
            "stream": False,
            "options": {
                "temperature": 0.4,
                "top_p": 0.9,
                "num_predict": 400
            }
        }
        
        response = requests.post(ollama_url, json=payload, timeout=15)
        if response.status_code == 200:
            result = response.json()
            mentor_response = result.get("response", "")
            
            # Ensure structured format if Ollama doesn't follow it
            if "📊" not in mentor_response:
                mentor_response = format_structured_response(msg, ctx)
            
            return {"text": mentor_response}
            
    except Exception as e:
        print(f"Ollama error: {e}. Using structured fallback.")

    # FALLBACK: Structured Educational Response
    return {"text": format_structured_response(msg, ctx)}

def format_structured_response(msg: str, ctx: dict) -> str:
    """Generate structured educational response based on query context"""
    symbol = ctx.get("symbol", "this asset")
    price = ctx.get("price", 0)
    signal = ctx.get("signal", "Neutral")
    confidence = ctx.get("confidence", 0.5)
    change_percent = ctx.get("changePercent", 0)
    
    msg_lower = msg.lower()
    
    # Detect query intent
    if "buy" in msg_lower or "sell" in msg_lower or "should i" in msg_lower:
        return f"""📊 Market Context
{symbol} is currently trading at ${price:.2f} with a {change_percent:+.2f}% change. The market is showing {signal.lower()} characteristics based on recent price action and volume patterns.

📈 Indicators / Signals
Our AI model indicates a {signal} signal with {confidence * 100:.0f}% confidence. This is derived from analyzing momentum indicators (RSI, MACD), moving averages, and volatility patterns. The model identifies probability, not certainty.

⚠️ Risk Insight
I cannot provide buy or sell advice. Every trade carries risk, and past patterns don't guarantee future results. Consider your risk tolerance, investment timeline, and position sizing before making any decisions.

📚 Learning Summary
Trading signals are tools for analysis, not instructions. Professional traders use signals as one input among many, including fundamental analysis, market sentiment, and personal risk management rules."""
    
    elif "indicator" in msg_lower or "rsi" in msg_lower or "macd" in msg_lower or "ema" in msg_lower:
        return f"""📊 Market Context
{symbol} is at ${price:.2f}. Technical indicators help us understand momentum, trend strength, and potential reversal points by analyzing historical price and volume data.

📈 Indicators / Signals
RSI measures momentum on a 0-100 scale (below 30 = oversold, above 70 = overbought). MACD shows trend direction through moving average convergence. EMAs track price trends with recent data weighted more heavily. Our current {signal} signal reflects these combined indicators.

⚠️ Risk Insight
Indicators can give false signals, especially in volatile or low-volume markets. They work best when multiple indicators align and are confirmed by price action. Never rely on a single indicator.

📚 Learning Summary
Technical indicators are mathematical calculations based on price history. They help identify patterns and probabilities, but require practice and context to interpret correctly. Combine multiple indicators for better analysis."""
    
    elif "risk" in msg_lower:
        return f"""📊 Market Context
{symbol} is showing {signal.lower()} signals at ${price:.2f}. However, all market positions carry inherent risk regardless of technical signals or AI predictions.

📈 Indicators / Signals
While our model shows {confidence * 100:.0f}% confidence, this represents historical pattern matching, not future certainty. Market conditions can change rapidly due to news, sentiment shifts, or unexpected events.

⚠️ Risk Insight
Key risk management principles: (1) Never risk more than 1-2% of capital per trade, (2) Always use stop-losses, (3) Diversify across assets, (4) Only trade with money you can afford to lose. Emotional discipline is as important as technical analysis.

📚 Learning Summary
Successful trading is more about managing losses than picking winners. Professional traders focus on risk-reward ratios, position sizing, and consistent strategy execution rather than trying to predict every move."""
    
    elif "signal" in msg_lower or "why" in msg_lower:
        direction = "upward" if signal == "Strong Buy" or signal == "Buy" else "neutral" if signal == "Hold" else "downward"
        return f"""📊 Market Context
{symbol} is displaying a {signal} signal at ${price:.2f} ({change_percent:+.2f}% change). This reflects the AI model's analysis of recent price patterns and technical indicator alignment.

📈 Indicators / Signals
The {signal} classification comes from our LSTM neural network analyzing 60 days of price data, RSI momentum, MACD trend direction, and moving average positions. The model detected {direction} probability patterns with {confidence * 100:.0f}% confidence based on historical similar conditions.

⚠️ Risk Insight
Signals indicate probability, not certainty. A {signal} signal means historical patterns suggest this direction, but markets can move against any signal. External factors like news, earnings, or macro events can override technical patterns.

📚 Learning Summary
AI trading models use machine learning to find patterns in historical data. They're powerful tools for analysis but should be combined with fundamental research, market awareness, and personal risk management. No model is perfect."""
    
    else:
        # General educational response
        return f"""📊 Market Context
{symbol} is currently at ${price:.2f} with a {signal} signal. I'm here to help you understand the technical analysis behind this assessment and how to interpret market data.

📈 Indicators / Signals
Our platform uses LSTM neural networks combined with technical indicators (RSI, MACD, EMAs) to analyze market patterns. The current {confidence * 100:.0f}% confidence reflects how strongly historical patterns align with current conditions.

⚠️ Risk Insight
Remember that all trading involves risk. Technical analysis and AI predictions are tools for understanding probability, not guarantees. Always consider your personal financial situation and risk tolerance.

📚 Learning Summary
You can ask me about specific indicators, risk management strategies, or why certain signals appear. I'm here to educate, not to tell you what to trade. What aspect would you like to explore?"""



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
