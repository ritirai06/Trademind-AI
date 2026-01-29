export const learningModules = [
    {
        id: 1,
        title: "MODULE 1: Beginner Trading Guide",
        shortTitle: "Principles",
        icon: "graduation-cap",
        content: [
            {
                heading: "What is Trading?",
                body: "Trading is the act of buying and selling financial assets (stocks, crypto, forex) to profit from price changes. Imagine buying a rare collectible for $100 and selling it for $150—that is a trade!"
            },
            {
                heading: "Market Mechanics",
                body: "Prices move based on the battle between BUYERS (Bulls) and SELLERS (Bears). \n- Liquidity: How fast you can trade without shifting the price.\n- Volatility: The 'speed' and 'intensity' of price swings."
            },
            {
                heading: "Risk & Uncertainty",
                body: "Trading is NOT gambling; it is a game of probabilities. No one knows the future 100%, but AI helps us find the 'most likely' direction."
            }
        ]
    },
    {
        id: 2,
        title: "MODULE 2: Candlestick & Price Action",
        shortTitle: "Candlesticks",
        icon: "bar-chart-2",
        content: [
            {
                heading: "The Anatomy of a Candle",
                body: "Candlesticks show the high, low, open, and close prices for a set time.\n\n  ▲  <-- High (Top Wick)\n  █  <-- Body (Range between Open/Close)\n  ▼  <-- Low (Bottom Wick)"
            },
            {
                heading: "Bullish vs Bearish",
                body: "🟢 Bullish (Green): Price went UP. Close > Open.\n🔴 Bearish (Red): Price went DOWN. Open > Close."
            },
            {
                heading: "How AI Reads This?",
                body: "Our AI (LSTM) processes OHLC (Open, High, Low, Close) sequences. It looks for 'Time-Series' patterns that humans might miss, like subtle momentum fades."
            }
        ]
    },
    {
        id: 3,
        title: "MODULE 3: Trend & Structure Indicators",
        shortTitle: "Trends",
        icon: "git-merge",
        content: [
            {
                heading: "EMA & SMA (Moving Averages)",
                body: "SMA is the simple average price. EMA gives more weight to recent prices. \n- Use: If price is above EMA, the trend is UP.\n- AI Use: AI uses EMAs to determine the 'Market Regime' (Trend vs Sideways)."
            },
            {
                heading: "Golden & Death Cross",
                body: "A Golden Cross (Short EMA crossing above Long EMA) is a massive BUY signal. A Death Cross is the opposite—a major SELL signal."
            },
            {
                heading: "Support & Resistance",
                body: "Support is the 'Floor' where buyers enter. Resistance is the 'Ceiling' where sellers defend. Breaking these often leads to massive 'Breakout' moves."
            }
        ]
    },
    {
        id: 4,
        title: "MODULE 4: Momentum Indicators",
        shortTitle: "Momentum",
        icon: "activity",
        content: [
            {
                heading: "RSI (Relative Strength Index)",
                body: "Measures if a stock is 'too expensive' or 'too cheap'.\n- Over 70: Overbought (Wait for a dip).\n- Under 30: Oversold (Potential buy zone)."
            },
            {
                heading: "MACD: The Trend Engine",
                body: "Shows the relationship between two moving averages. When the MACD line crosses the 'Signal line', momentum is shifting."
            },
            {
                heading: "Psychology",
                body: "Indicators represent human emotions. High RSI = Greedy buyers. Low RSI = Fearful sellers. Trading is 90% psychology!"
            }
        ]
    },
    {
        id: 5,
        title: "MODULE 5: Volatility & Risk Metrics",
        shortTitle: "Risk Metrics",
        icon: "shield-alert",
        content: [
            {
                heading: "ATR & Standard Deviation",
                body: "ATR tells you how much an asset moves per day on average. It helps you set 'Stop Losses' so you don't get kicked out by normal noise."
            },
            {
                heading: "Sharpe Ratio & Beta",
                body: "Sharpe Ratio: Is the return worth the risk? (Higher = Better).\nBeta: How much does this move compared to the general market? (Beta > 1 is high octane)."
            }
        ]
    },
    {
        id: 6,
        title: "MODULE 6: AI & Prediction Concepts",
        shortTitle: "AI Deep Dive",
        icon: "cpu",
        content: [
            {
                heading: "What is LSTM?",
                body: "Long Short-Term Memory (LSTM) is a type of Deep Learning that can 'remember' patterns from days ago. It treats the market like a language it's trying to translate."
            },
            {
                heading: "Confidence Scoring",
                body: "Our AI assigns a percentage to every guess. \n- 90%+: High probability pattern detected.\n- <60%: 'Noise' detected; market is too random to guess."
            },
            {
                heading: "High-Low Zone Prediction",
                body: "AI calculates the likely boundary for the next 24 hours. If price hits the 'AI Low Zone', it's often a high-probability bounce area."
            }
        ]
    },
    {
        id: 7,
        title: "MODULE 7: Platform Feature Guide",
        shortTitle: "The App",
        icon: "compass",
        content: [
            {
                heading: "Reading the Dashboard",
                body: "1. Check Live Price.\n2. Verify the AI Forecast (Target & Signal).\n3. Check Technical Strength (EMA/RSI).\n4. Combine all for a high-conviction trade."
            },
            {
                heading: "Common Mistakes",
                body: "Overtrading, ignoring stop losses, and trading when AI confidence is low. Always trade only when multiple 'Confluences' align."
            }
        ]
    },
    {
        id: 8,
        title: "MODULE 8: Ethics & Discipline",
        shortTitle: "Ethics",
        icon: "bookmark",
        content: [
            {
                heading: "Risk Disclaimer",
                body: "TradeMind AI is an educational tool. We provide intelligence, NOT financial advice. You are responsible for your own capital."
            },
            {
                heading: "Responsible Usage",
                body: "Trading is a marathon, not a sprint. Never use more than 2% of your total account on a single trade. Keep your emotions in check."
            }
        ]
    }
];
