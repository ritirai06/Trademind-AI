# 📈 TradeMind AI: Intelligent Trading Ecosystem

TradeMind AI is a professional, high-performance trading platform that leverages **LSTM (Long Short-Term Memory)** neural networks and **Local LLMs (Ollama)** to provide real-time market analysis, predictive forecasting, and a comprehensive educational ecosystem.

The platform features a stunning, AI-driven dashboard built with **React + Vite** and a robust **FastAPI** backend for low-latency data processing.

---

## ✨ Key Features

*   **AI-Powered Predictions**: LSTM models that forecast next-close prices with confidence scores.
*   **Trading Sikhe (Learn Trading)**: A modular learning academy with structured trading roadmaps.
*   **Paper Trading Simulator**: Risk-free virtual trading environment with a live trade journal and P/L tracking.
*   **Global AI Mentor (Siu)**: A persistent, floating AI assistant powered by **Ollama** that explains market indicators and educates users across all views.
*   **Real-time Analytics**: Live market tracking across Stocks, Crypto, and Forex using advanced technical indicators (RSI, MACD, EMA).
*   **Premium Glassmorphism UI**: A sleek, dark-themed dashboard focused on data clarity and user experience.

---

## 🏗️ Project Architecture

```text
trademind-ai/
├── frontend/             # ⚛️ React Dashboard (Floating AI Mentor, Trading Sikhe)
│   ├── src/pages/        # Dashboard, Login, Academy, Simulator
│   └── src/components/   # Professional UI components & Recharts VIS
├── backend/              # 🐍 FastAPI REST API
│   └── main.py           # API endpoints, Paper Trading logic & Ollama integration
├── ml_engine/            # 🧠 LSTM Intelligence
│   ├── train_lstm.py     # Model training pipeline
│   ├── predict.py        # Inference engine
│   └── indicators.py     # Technical analysis library
├── data_collector/       # 📡 Market Data Connectors (Finnhub, YFinance)
├── database/             # 🗄️ SQLite Time-series & User Progress Storage
└── models/               # 📁 Exported Neural Networks (.h5)
```

---

## 🚀 Quick Start

### 1. Requirements
*   Python 3.10+
*   Node.js 18+
*   **Ollama** (Optional, for AI Mentor) - Download at [ollama.com](https://ollama.com)

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start Ollama (if using AI Mentor)
ollama run llama3

# Configuration
# Create a .env file with your API keys (DATABASE_PATH, etc.)

# Start the Backend Server
python backend/main.py
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Launch Development Server
npm run dev
```

---

## 🛠️ Tech Stack

*   **Frontend**: React 19, Vite, Framer Motion, Lucide Icons, Recharts, Axios.
*   **Backend**: FastAPI, Uvicorn, Pydantic, Requests.
*   **AI/LLM**: Ollama (Llama3/Mistral) for Mentorship, TensorFlow (LSTM) for Prediction.
*   **ML Integration**: Scikit-learn, Pandas, NumPy.
*   **Database**: SQLite.

---

## 📊 Roadmap
- [x] LSTM Model Implementation
- [x] FastAPI Backend Scaffolding
- [x] Professional Glassmorphism UI
- [x] **Trading Sikhe** Educational Module
- [x] **Global AI Mentor** Integration (Ollama)
- [x] **Paper Trading Simulator** & Journal
- [ ] Websocket integration for tick-by-tick data
- [ ] Multi-user collaborative paper trading leagues

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

Developed with ❤️ for the future of Finance.
# Trademind-AI
