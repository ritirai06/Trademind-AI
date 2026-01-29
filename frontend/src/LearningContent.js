export const learningModules = [
    {
        id: 1,
        title: "MODULE 1: Global Market Essentials",
        shortTitle: "Principles",
        icon: "globe",
        content: [
            {
                heading: "What exactly is Trading?",
                body: "Trading is not just clicking buttons; it is the art of participating in the world's largest auction. When you trade, you are exchanging capital for assets (like Stocks or Crypto) with the expectation that the market's perception of that asset's value will change. If you buy low and sell high, you capture the difference as profit."
            },
            {
                heading: "The Battle of Bulls and Bears",
                body: "Every price movement is caused by supply and demand. \n- Bulls: Investors who believe the price will go UP. They provide 'Buying Pressure'.\n- Bears: Investors who believe the price will go DOWN. They provide 'Selling Pressure'.\nWhen Bulls are stronger, prices rise. When Bears take control, prices fall."
            },
            {
                heading: "Market Liquidity & Spread",
                body: "Liquidity refers to how easily an asset can be bought or sold without affecting its price. High liquidity (like AAPL or BTC) means you can trade instantly. The 'Spread' is the difference between the Buy (Ask) and Sell (Bid) price—the hidden cost of every trade."
            },
            {
                heading: "AI's Role in Modern Markets",
                body: "Today, over 80% of volume is driven by algorithms. TradeMind AI uses Deep Learning to look through thousands of data points to spot 'Institutional Footprints'—patterns where big players are entering the market."
            }
        ]
    },
    {
        id: 2,
        title: "MODULE 2: Mastering Candlesticks",
        shortTitle: "Candlesticks",
        icon: "bar-chart-2",
        content: [
            {
                heading: "Reading the Price Action",
                body: "A candlestick is a pictorial representation of a battle. Each candle tells a story of what happened during a specific time (1 min, 1 hour, or 1 day).\n- The Body: Shows the range between the Open and Close.\n- The Wicks (Shadows): Show the highest and lowest prices reached, even if the price didn't stay there."
            },
            {
                heading: "Bullish vs Bearish Patterns",
                body: "🟢 Green Candle: The Bulls won. The close was higher than the open.\n🔴 Red Candle: The Bears won. The open was higher than the close.\n\nLong wicks on top mean 'Rejection'—bears pushed the price back down. Long wicks on bottom mean 'Support'—bulls pushed the price back up."
            },
            {
                heading: "High-Probability Patterns",
                body: "Look for 'Engulfing' candles where one candle completely covers the previous one. This signals a total shift in power. Our LSTM models analyze these sequences to find where the next 'Breakout' might happen."
            }
        ]
    },
    {
        id: 3,
        title: "MODULE 3: Trends & Moving Averages",
        shortTitle: "Trends",
        icon: "trending-up",
        content: [
            {
                heading: "Understanding the Trend Structure",
                body: "The trend is your friend! Markets move in three directions: Up, Down, or Sideways (Chop). \n- Up-trend: Higher Highs and Higher Lows.\n- Down-trend: Lower Highs and Lower Lows."
            },
            {
                heading: "The Power of EMA (Exponential Moving Average)",
                body: "Moving Averages smooth out the 'noise' to reveal the true trend. EMA (Exponential) is faster and more sensitive to recent data than SMA (Simple).\n- 20 EMA: Short-term momentum.\n- 50 EMA: Medium-term trend support.\nWhen the price is above these lines, you should primary look for BUY opportunities."
            },
            {
                heading: "The 'Cross-Over' Strategy",
                body: "When a fast EMA (like 20) crosses above a slow EMA (like 50), it generates a 'Golden Cross'—a sign that a massive uptrend is starting. TradeMind AI monitors these crosses across 50+ assets simultaneously."
            }
        ]
    },
    {
        id: 4,
        title: "MODULE 4: Momentum & Oscillator Mastery",
        shortTitle: "Momentum",
        icon: "activity",
        content: [
            {
                heading: "RSI: The Exhaustion Meter",
                body: "The Relative Strength Index (RSI) tells you if the price is 'stretching' too far. \n- Over 70: Overbought (Buyers are exhausted, price might drop).\n- Under 30: Oversold (Sellers are exhausted, price might bounce).\nProfessional traders use RSI to avoid 'Buying the Top'."
            },
            {
                heading: "MACD: Momentum Confirmation",
                body: "The Moving Average Convergence Divergence (MACD) shows the 'strength' of the move. If the bars are getting taller, the momentum is increasing. If they shrink, the trend is weakening even if price is still moving up."
            },
            {
                heading: "The AI Edge with Oscillators",
                body: "Standard RSI is 14 periods. Our AI analyzes multi-timeframe RSI (5-period, 14-period, and 30-period) to find 'Divergences'—where indicators say one thing, but price does another. This is the ultimate signal of a trend reversal."
            }
        ]
    },
    {
        id: 5,
        title: "MODULE 5: Risk Management & Psychology",
        shortTitle: "Risk Control",
        icon: "shield-check",
        content: [
            {
                heading: "The 1% Rule",
                body: "Never risk more than 1% of your total virtual balance on a single trade. If you have $100,000, you should only lose a max of $1,000 if the trade goes wrong. This ensures you can survive even a 10-trade losing streak."
            },
            {
                heading: "Stop-Loss: Your Executioner",
                body: "A Stop-Loss is your exit plan. It kills the trade automatically when your 'Idea' is proven wrong. Without a Stop-Loss, you aren't trading; you are hoping. Hope is not a strategy."
            },
            {
                heading: "Overcoming Fear & Greed",
                body: "The market is designed to trigger your emotions. Greed makes you buy at the top; Fear makes you sell at the bottom. Our AI signals are 'Emotionless'—they follow math, not feelings. Trust the plan, not the impulse."
            }
        ]
    },
    {
        id: 6,
        title: "MODULE 6: TradeMind AI Architecture",
        shortTitle: "AI Wisdom",
        icon: "cpu",
        content: [
            {
                heading: "What is LSTM Deep Learning?",
                body: "LSTM (Long Short-Term Memory) is a neural network that can 'remember' long-term dependencies. It looks at the price action of the last 30 days to understand the current context. It doesn't just see pixels; it sees the flow of time."
            },
            {
                heading: "High-Probability Signal Zones",
                body: "Our models calculate price 'Boundaries'. When price hits our 'AI Lower Boundary' and indicators show 'Oversold', the probability of a win increases significantly. This is what we call a 'Confluence Zone'."
            },
            {
                heading: "Confidence & Explainability",
                body: "Every prediction comes with a confidence score. If confidence is below 70%, the market is 'Noisy' and the best trade is NO trade. Capital preservation is the first step to wealth."
            }
        ]
    },
    {
        id: 7,
        title: "MODULE 7: Practical Execution Guide",
        shortTitle: "Execution",
        icon: "zap",
        content: [
            {
                heading: "How to use these Signals?",
                body: "A high-conviction trade happens when 'Confluences' align. \nExample: \n1. AI Signal shows 'Strong Buy'.\n2. Price is at a major EMA support.\n3. RSI is recovering from oversold (<30).\nWhen these 3 happen together, your probability of success is much higher."
            },
            {
                heading: "Managing the Trade",
                body: "Once in a trade, don't watch every tick—it will make you emotional. Respect your stop-loss and take-profit levels. If the AI trend changes to 'Weakness', consider exiting even if your target isn't hit."
            }
        ]
    },
    {
        id: 8,
        title: "MODULE 8: Discipline & Ethical Growth",
        shortTitle: "Discipline",
        icon: "bookmark",
        content: [
            {
                heading: "Consistency over Home-runs",
                body: "Don't try to double your money in one day. Focus on making 1-2% profit consistently. Compounding small gains is how wealth is built. Trading is a profession of patience."
            },
            {
                heading: "Final Disclaimer",
                body: "TradeMind AI is your co-pilot, not the pilot. You have the final control over your capital. Use the knowledge gained here to build your own edge in the markets."
            }
        ]
    }
];
