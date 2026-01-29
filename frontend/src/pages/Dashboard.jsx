import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    LayoutDashboard,
    Activity,
    Zap,
    Settings,
    Bell,
    Search,
    ArrowUpRight,
    ArrowDownRight,
    LogOut,
    User as UserIcon,
    RefreshCw,
    Globe,
    Newspaper,
    Compass,
    CheckCircle,
    BookOpen,
    ChevronRight,
    GraduationCap,
    ExternalLink,
    Clock,
    Filter,
    BarChart2,
    PieChart,
    ShieldCheck,
    ZapOff
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { learningModules } from '../LearningContent';

const Dashboard = () => {
    const [currentView, setCurrentView] = useState('dashboard');
    const [marketData, setMarketData] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [newsData, setNewsData] = useState([]);
    const [chartInterval, setChartInterval] = useState('1h');
    const [symbol, setSymbol] = useState('AAPL');
    const [userData, setUserData] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserData(user);
        fetchData();
        fetchHistory();
        fetchNews();
    }, [symbol]);

    useEffect(() => {
        fetchHistory();
    }, [chartInterval]);

    const fetchNews = async () => {
        try {
            const res = await axios.get('/api/news');
            setNewsData(res.data);
        } catch (err) {
            console.error("News fetch error", err);
        }
    };

    const fetchData = async () => {
        try {
            const res = await axios.get(`/api/market-data/${symbol}`);
            const predRes = await axios.get(`/api/predict/${symbol}`);

            setMarketData({
                symbol: symbol,
                price: res.data.price,
                change: res.data.change,
                changePercent: res.data.change_percent,
                prediction: {
                    nextClose: predRes.data.predicted_next_close,
                    confidence: predRes.data.confidence,
                    signal: predRes.data.predicted_next_close > res.data.price ? 'Strong Buy' : 'Hold'
                }
            });
        } catch (err) {
            setMarketData({
                symbol: symbol,
                price: 152.45,
                change: 3.12,
                changePercent: 1.84,
                prediction: { nextClose: 154.20, confidence: 0.88, signal: 'Strong Buy' }
            });
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`/api/history/${symbol}?interval=${chartInterval}`);
            setHistoryData(res.data);
        } catch (err) {
            setHistoryData([]);
        }
    };

    const logout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        toast.success("Logged out successfully");
        navigate('/login');
    };

    const renderContent = () => {
        switch (currentView) {
            case 'dashboard': return <DashboardOverview marketData={marketData} historyData={historyData} interval={chartInterval} setInterval={setChartInterval} newsData={newsData} />;
            case 'analysis': return <MarketAnalysis symbol={symbol} />;
            case 'signals': return <SignalsView onAction={(s) => { setSymbol(s); setCurrentView('analysis'); }} />;
            case 'learn': return <LearnView />;
            case 'settings': return <SettingsView userData={userData} />;
            case 'sikhe': return <TradingSikhe userData={userData} symbol={symbol} marketData={marketData} />;
            default: return <DashboardOverview marketData={marketData} historyData={historyData} interval={chartInterval} setInterval={setChartInterval} newsData={newsData} />;
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <TrendingUp size={24} color="#6366f1" />
                    <span>TradeMind AI</span>
                </div>

                <nav className="sidebar-nav">
                    <button className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentView('dashboard')}>
                        <LayoutDashboard size={20} /> Dashboard
                    </button>
                    <button className={`nav-item ${currentView === 'analysis' ? 'active' : ''}`} onClick={() => setCurrentView('analysis')}>
                        <Activity size={20} /> Analysis
                    </button>
                    <button className={`nav-item ${currentView === 'signals' ? 'active' : ''}`} onClick={() => setCurrentView('signals')}>
                        <Zap size={20} /> AI Signals
                    </button>

                    <div className="nav-group-label">Education</div>
                    <button className={`nav-item learn-nav ${currentView === 'learn' ? 'active' : ''}`} onClick={() => setCurrentView('learn')}>
                        <BookOpen size={20} /> Knowledge Base
                    </button>
                    <button className={`nav-item sikhe-nav ${currentView === 'sikhe' ? 'active' : ''}`} onClick={() => setCurrentView('sikhe')}>
                        <GraduationCap size={20} /> Trading Sikhe
                    </button>

                    <div className="nav-group-label">System</div>
                    <button className={`nav-item ${currentView === 'settings' ? 'active' : ''}`} onClick={() => setCurrentView('settings')}>
                        <Settings size={20} /> Settings
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-item logout-btn" onClick={logout}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="dashboard-header">
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search symbol (BTC-USD, TSLA)..."
                            onKeyPress={(e) => e.key === 'Enter' && setSymbol(e.target.value.toUpperCase())}
                        />
                    </div>

                    <div className="header-actions">
                        <div className="market-status glass-card">
                            <span className="pulse"></span> Live Market
                        </div>

                        <div className="notification-wrapper" ref={notificationRef}>
                            <button className="icon-btn" onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}>
                                <Bell size={20} />
                                <span className="notif-badge"></span>
                            </button>
                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="dropdown-menu notification-dropdown">
                                        <div className="dropdown-header">Notifications</div>
                                        <div className="dropdown-content">
                                            <div className="notif-item">
                                                <Zap size={14} color="#6366f1" />
                                                <div>
                                                    <p>New "Strong Buy" signal for <b>BTC-USD</b></p>
                                                    <span>2 mins ago</span>
                                                </div>
                                            </div>
                                            <div className="notif-item">
                                                <Activity size={14} color="#10b981" />
                                                <div>
                                                    <p>Market Volatility is high. Check Analysis.</p>
                                                    <span>15 mins ago</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="profile-wrapper" ref={profileRef}>
                            <div className="profile-trigger" onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}>
                                <div className="avatar">{userData?.full_name?.charAt(0) || 'U'}</div>
                                <span>{userData?.full_name?.split(' ')[0]}</span>
                            </div>
                            <AnimatePresence>
                                {showProfile && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="dropdown-menu profile-dropdown">
                                        <button onClick={() => { setCurrentView('settings'); setShowProfile(false); }}><UserIcon size={16} /> Profile Settings</button>
                                        <button onClick={() => { setCurrentView('analysis'); setShowProfile(false); }}><Activity size={16} /> My Analysis</button>
                                        <div className="divider"></div>
                                        <button className="logout-action" onClick={logout}><LogOut size={16} /> Sign Out</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <div className="view-container">
                    {renderContent()}
                </div>

                {/* GLOBAL AI MENTOR (PERSISTENT) */}
                <FloatingMentor userData={userData} symbol={symbol} marketData={marketData} />
            </main>

            <style jsx>{`
        .dashboard-layout { display: flex; height: 100vh; background: #020617; color: #f8fafc; }
        .sidebar { width: 280px; border-right: 1px solid rgba(255,255,255,0.05); padding: 32px; display: flex; flex-direction: column; background: #010409; }
        .sidebar-brand { display: flex; align-items: center; gap: 12px; font-size: 22px; font-weight: 800; margin-bottom: 48px; }
        .sidebar-nav { display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .nav-group-label { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; margin: 20px 0 10px 16px; letter-spacing: 1px; }
        .nav-item { 
          display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; 
          color: #94a3b8; transition: all 0.2s; background: transparent; border: none; width: 100%; cursor: pointer;
          font-family: inherit; font-size: 15px; font-weight: 600; text-align: left;
        }
        .nav-item:hover { background: rgba(255,255,255,0.03); color: #fff; }
        .nav-item.active { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
        .learn-nav.active { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .logout-btn { color: #f43f5e; margin-top: auto; }

        .main-content { flex: 1; padding: 32px; overflow-y: auto; display: flex; flex-direction: column; }
        .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .search-bar { position: relative; width: 450px; }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #475569; }
        .search-bar input { 
          padding-left: 48px; width: 100%; background: #0d1117; border: 1px solid rgba(255,255,255,0.05); 
          border-radius: 14px; height: 48px; color: #fff; font-size: 15px; outline: none;
        }
        .search-bar input:focus { border-color: #6366f1; }
        
        .header-actions { display: flex; align-items: center; gap: 16px; }
        .market-status { padding: 8px 16px; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 8px; border-radius: 100px; }
        .pulse { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 10px #10b981; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

        .icon-btn { 
          background: #0d1117; border: 1px solid rgba(255,255,255,0.05); color: #94a3b8; 
          width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .profile-trigger { 
          display: flex; align-items: center; gap: 12px; background: #0d1117; 
          padding: 6px 16px 6px 6px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.05); color: #fff;
        }
        .avatar { width: 36px; height: 36px; border-radius: 50%; background: #6366f1; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; }

        .view-container { flex: 1; }

        .notification-wrapper, .profile-wrapper { position: relative; }
        .dropdown-menu { 
          position: absolute; top: calc(100% + 12px); right: 0; width: 280px; 
          background: #0d1117; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.4); z-index: 1000; overflow: hidden;
        }
        .dropdown-header { padding: 16px; font-size: 13px; font-weight: 700; color: #64748b; border-bottom: 1px solid rgba(255,255,255,0.05); text-transform: uppercase; letter-spacing: 0.5px; }
        .notif-item { display: flex; gap: 12px; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.03); transition: background 0.2s; cursor: pointer; text-align: left; }
        .notif-item:hover { background: rgba(255,255,255,0.02); }
        .notif-item p { font-size: 13px; margin-bottom: 4px; color: #e2e8f0; margin: 0; }
        .notif-item span { font-size: 11px; color: #475569; }
        .notif-badge { position: absolute; top: 12px; right: 12px; width: 8px; height: 8px; background: #f43f5e; border-radius: 50%; border: 2px solid #0d1117; }

        .profile-dropdown { width: 220px; padding: 8px; }
        .profile-dropdown button { 
          width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px; 
          border-radius: 10px; border: none; background: transparent; color: #94a3b8; 
          font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.2s;
        }
        .profile-dropdown button:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .profile-trigger { cursor: pointer; transition: 0.2s; }
        .profile-trigger:hover { border-color: rgba(99, 102, 241, 0.4); }
        .divider { height: 1px; background: rgba(255,255,255,0.05); margin: 8px 0; }
        .logout-action { color: #f43f5e !important; }
        .logout-action:hover { background: rgba(244, 63, 94, 0.1) !important; }
      `}</style>
        </div>
    );
};

/* --- SUB-COMPONENTS --- */

const DashboardOverview = ({ marketData, historyData, interval, setInterval, newsData }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="overview-container">
        <div className="hero-grid">
            <div className="glass-card main-stat-card">
                <div className="card-top">
                    <div>
                        <span className="label">SYMBOL: {marketData?.symbol}</span>
                        <h2>${marketData?.price?.toFixed(2)}</h2>
                    </div>
                    <div className={`price-badge ${marketData?.change >= 0 ? 'up' : 'down'}`}>
                        {marketData?.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {marketData?.changePercent}%
                    </div>
                </div>
                <div className="meta-stats">
                    <div className="m-item"><span>Range High</span> <h4>$158.4</h4></div>
                    <div className="m-item"><span>Range Low</span> <h4>$151.0</h4></div>
                    <div className="m-item"><span>Volume</span> <h4>54.2M</h4></div>
                </div>
            </div>

            <div className="glass-card intelligence-card">
                <div className="intelligence-header">
                    <Zap size={20} color="#6366f1" />
                    <h3>AI Signal Engine</h3>
                </div>
                <div className="intel-content">
                    <div className="predict-stat">
                        <span>Target Prediction</span>
                        <h3>${marketData?.prediction.nextClose?.toFixed(2)}</h3>
                    </div>
                    <div className="confidence-meter">
                        <div className="meter-label">AI Confidence: {(marketData?.prediction.confidence * 100).toFixed(0)}%</div>
                        <div className="meter-track"><div className="meter-fill" style={{ width: `${marketData?.prediction.confidence * 100}%` }}></div></div>
                    </div>
                    <div className={`signal-box ${marketData?.prediction.signal.toLowerCase().replace(' ', '-')}`}>
                        {marketData?.prediction.signal}
                    </div>
                </div>
            </div>
        </div>

        <div className="main-content-grid">
            <div className="chart-section glass-card">
                <div className="chart-header">
                    <h3>Price Action Analytics</h3>
                    <div className="chart-tools">
                        {['1h', '4h', '1d'].map(i => (
                            <button key={i} className={interval === i ? 'active' : ''} onClick={() => setInterval(i)}>{i.toUpperCase()}</button>
                        ))}
                    </div>
                </div>
                <div className="main-chart">
                    <ResponsiveContainer width="100%" height={380}>
                        <AreaChart data={historyData}>
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="name" stroke="#475569" fontSize={11} axisLine={false} tickLine={false} />
                            <YAxis stroke="#475569" fontSize={11} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                            <Area type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={3} fill="url(#chartGradient)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="news-section glass-card">
                <div className="news-header-top">
                    <Newspaper size={20} color="#6366f1" />
                    <h3>Live Market News</h3>
                </div>
                <div className="news-scroll">
                    {newsData.length > 0 ? newsData.map((news) => (
                        <a key={news.id} href={news.url} target="_blank" rel="noopener noreferrer" className="news-item-link">
                            <div className="news-card-inner">
                                <div className="news-meta">
                                    <span className="source">{news.source}</span>
                                    <span className="time"><Clock size={12} /> {new Date(news.datetime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <h4>{news.headline}</h4>
                                <p>{news.summary.substring(0, 100)}...</p>
                                <div className="view-more">Read More <ExternalLink size={14} /></div>
                            </div>
                        </a>
                    )) : (
                        <div className="news-loading">Fetching latest headlines...</div>
                    )}
                </div>
            </div>
        </div>

        <style jsx>{`
      .overview-container { display: flex; flex-direction: column; gap: 24px; }
      .hero-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 24px; }
      .main-stat-card { padding: 32px; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; }
      .main-stat-card::after { content: ''; position: absolute; top: -50%; right: -50%; width: 100%; height: 100%; background: radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%); }
      .card-top h2 { font-size: 42px; font-weight: 800; margin-top: 4px; letter-spacing: -1px; }
      .price-badge { padding: 6px 14px; border-radius: 100px; font-weight: 800; font-size: 14px; display: flex; align-items: center; gap: 4px; }
      .price-badge.up { background: rgba(16, 185, 129, 0.1); color: #10b981; }
      .price-badge.down { background: rgba(244, 63, 94, 0.1); color: #f43f5e; }
      .meta-stats { display: flex; gap: 32px; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.05); }
      .m-item span { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
      .m-item h4 { font-size: 16px; margin-top: 4px; }

      .intelligence-card { padding: 32px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(15, 23, 42, 0) 100%); }
      .intelligence-header { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
      .intel-content { display: flex; flex-direction: column; gap: 20px; }
      .predict-stat h3 { font-size: 32px; color: #6366f1; margin-top: 4px; font-weight: 800; }
      .meter-track { height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-top: 8px; }
      .meter-fill { height: 100%; background: #6366f1; border-radius: 10px; box-shadow: 0 0 15px rgba(99, 102, 241, 0.5); transition: width 1s ease-in-out; }
      .signal-box { padding: 12px; border-radius: 12px; text-align: center; font-weight: 800; font-size: 14px; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.05); }
      .signal-box.strong-buy { background: #6366f1; color: #fff; }

      .main-content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
      .chart-section { padding: 32px; }
      .chart-header { display: flex; justify-content: space-between; margin-bottom: 32px; }
      .chart-tools { display: flex; background: rgba(255,255,255,0.03); padding: 4px; border-radius: 8px; }
      .chart-tools button { padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 700; color: #64748b; background: transparent; border: none; cursor: pointer; }
      .chart-tools button.active { background: rgba(255,255,255,0.1); color: #fff; }

      .news-section { padding: 32px; display: flex; flex-direction: column; }
      .news-header-top { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
      .news-header-top h3 { font-size: 18px; font-weight: 700; }
      .news-scroll { overflow-y: auto; max-height: 500px; padding-right: 10px; }
      .news-scroll::-webkit-scrollbar { width: 4px; }
      .news-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      
      .news-item-link { text-decoration: none; color: inherit; display: block; margin-bottom: 16px; transition: transform 0.2s; }
      .news-item-link:hover { transform: translateX(5px); }
      .news-card-inner { padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; }
      .news-meta { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; }
      .news-card-inner h4 { font-size: 15px; font-weight: 700; margin-bottom: 8px; line-height: 1.4; color: #fff; }
      .news-card-inner p { font-size: 13px; color: #94a3b8; line-height: 1.5; margin-bottom: 12px; }
      .view-more { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: #6366f1; }
    `}</style>
    </motion.div>
);

const MarketAnalysis = ({ symbol }) => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/analysis/${symbol}`);
                setAnalysis(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalysis();
    }, [symbol]);

    if (loading) return <div className="news-loading">Running technical scan for {symbol}...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="analysis-container">
            <div className="analysis-grid">
                <div className="glass-card big-card">
                    <div className="card-header">
                        <Compass size={24} color="#6366f1" />
                        <h2>Technical Profile: {symbol}</h2>
                    </div>
                    <div className="indicators-grid">
                        {analysis?.indicators?.map((ind, i) => (
                            <div key={i} className="indicator-node">
                                <span className="label">{ind.name}</span>
                                <div className="val-row">
                                    <h3>{ind.value}</h3>
                                    <span className="status" style={{ color: ind.color }}>{ind.status}</span>
                                </div>
                                <div className="progress-bg"><div className="progress-fill" style={{ width: '70%', background: ind.color }}></div></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card summary-card">
                    <div className="card-header">
                        <ShieldCheck size={24} color="#10b981" />
                        <h2>Market Sentiment</h2>
                    </div>
                    <div className="sentiment-meter">
                        <div className="meter-circle" style={{ borderColor: analysis?.sentiment > 50 ? '#10b981' : '#f43f5e' }}>
                            <div className="inner-text">
                                <h1>{analysis?.sentiment}%</h1>
                                <span>{analysis?.sentiment > 50 ? 'BULLISH' : 'BEARISH'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="sentiment-details">
                        <p>{analysis?.summary}</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .analysis-container { display: flex; flex-direction: column; gap: 24px; }
                .analysis-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
                .big-card, .summary-card { padding: 32px; }
                .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
                .card-header h2 { font-size: 20px; font-weight: 700; }
                
                .indicators-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
                .indicator-node { padding: 20px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; }
                .label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 8px; }
                .val-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
                .val-row h3 { font-size: 24px; font-weight: 800; }
                .status { font-size: 12px; font-weight: 800; text-transform: uppercase; }
                .progress-bg { height: 4px; background: rgba(255,255,255,0.05); border-radius: 10px; }
                .progress-fill { height: 100%; border-radius: 10px; }

                .sentiment-meter { display: flex; justify-content: center; margin: 20px 0; }
                .meter-circle { 
                    width: 150px; height: 150px; border-radius: 50%; 
                    border: 8px solid #10b981; border-top-color: transparent; 
                    display: flex; align-items: center; justify-content: center;
                    transform: rotate(45deg);
                }
                .inner-text { transform: rotate(-45deg); text-align: center; }
                .inner-text h1 { font-size: 32px; font-weight: 800; color: #fff; }
                .inner-text span { font-size: 10px; font-weight: 800; color: #10b981; }
                .sentiment-details { text-align: center; color: #94a3b8; font-size: 14px; line-height: 1.6; }
            `}</style>
        </motion.div>
    );
};

const SignalsView = ({ onAction }) => {
    const [signals, setSignals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSignals = async () => {
            try {
                const res = await axios.get('/api/all-signals');
                setSignals(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSignals();
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="signals-container">
            <div className="glass-card signals-card">
                <div className="signals-header-ui">
                    <div className="h-left">
                        <Zap size={24} color="#6366f1" />
                        <div>
                            <h2>Global Market Signals</h2>
                            <p>AI-driven opportunity scanning</p>
                        </div>
                    </div>
                </div>

                <div className="signals-table-ui">
                    <div className="th-row">
                        <span>Asset</span>
                        <span>Signal</span>
                        <span>Confidence</span>
                        <span>Price</span>
                        <span>Action</span>
                    </div>
                    <div className="tb-body">
                        {loading ? <div className="news-loading">Scanning markets...</div> : signals.map((sig, i) => (
                            <div key={i} className="tr-row">
                                <span className="s-name">{sig.s}</span>
                                <span><div className="sig-badge" style={{ background: sig.color + '1a', color: sig.color }}>{sig.type}</div></span>
                                <span><div className="conf-bar-ui"><div className="fill" style={{ width: sig.conf, background: sig.color }}></div><span>{sig.conf}</span></div></span>
                                <span className="s-price">{sig.price}</span>
                                <span><button className="view-details" onClick={() => onAction(sig.s)}>Analyze Asset</button></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
            .signals-card { padding: 32px; }
            .signals-header-ui { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
            .h-left { display: flex; align-items: center; gap: 16px; }
            .h-left h2 { font-size: 24px; font-weight: 800; }
            .h-left p { color: #64748b; font-size: 14px; }
            .h-right { display: flex; gap: 12px; }

            .signals-table-ui { display: flex; flex-direction: column; }
            .th-row { display: grid; grid-template-columns: 1.5fr 1fr 1.5fr 1fr 1fr; padding: 16px; color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.05); }
            .tr-row { display: grid; grid-template-columns: 1.5fr 1fr 1.5fr 1fr 1fr; padding: 24px 16px; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.03); transition: background 0.2s; }
            .tr-row:hover { background: rgba(255,255,255,0.02); }
            
            .s-name { font-weight: 800; font-size: 15px; }
            .sig-badge { padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 800; text-transform: uppercase; display: inline-block; }
            .conf-bar-ui { display: flex; align-items: center; gap: 12px; font-size: 12px; font-weight: 700; }
            .conf-bar-ui .fill { height: 6px; border-radius: 10px; }
            .s-price { font-family: 'JetBrains Mono', monospace; font-weight: 600; }
            .view-details { padding: 8px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; cursor: pointer; transition: 0.2s; font-size: 13px; font-weight: 600; }
            .view-details:hover { background: #6366f1; border-color: #6366f1; }
        `}</style>
        </motion.div>
    );
};

const LearnView = () => {
    const [selectedModule, setSelectedModule] = useState(learningModules[0]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="learn-container">
            <div className="learn-sidebar glass-card">
                <h3>Academy Roadmap</h3>
                <div className="module-list">
                    {learningModules.map((m) => (
                        <button
                            key={m.id}
                            className={`module-btn ${selectedModule.id === m.id ? 'active' : ''}`}
                            onClick={() => setSelectedModule(m)}
                        >
                            <span className="m-num">{m.id}</span>
                            <div className="m-info">
                                <h4>{m.shortTitle}</h4>
                                <span>{m.title.split(':')[0]}</span>
                            </div>
                            <ChevronRight size={16} />
                        </button>
                    ))}
                </div>
            </div>

            <div className="learn-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedModule.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="glass-card article-card"
                    >
                        <div className="article-header">
                            <div className="badge"><GraduationCap size={14} /> TradeMind Academy</div>
                            <h1>{selectedModule.title}</h1>
                        </div>

                        <div className="article-body">
                            {selectedModule.content.map((sec, i) => (
                                <div key={i} className="content-section">
                                    <h3>{sec.heading}</h3>
                                    <p>{sec.body}</p>
                                </div>
                            ))}
                        </div>

                        <div className="article-footer">
                            <div className="tip-box">
                                <Zap size={18} color="#f59e0b" />
                                <p><b>Pro Tip:</b> Combine this knowledge with the live AI forecast on your dashboard for maximum precision.</p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <style jsx>{`
                .learn-container { display: grid; grid-template-columns: 320px 1fr; gap: 32px; height: calc(100vh - 160px); }
                .learn-sidebar { padding: 24px; display: flex; flex-direction: column; overflow-y: auto; }
                .learn-sidebar h3 { margin-bottom: 24px; font-size: 18px; color: #94a3b8; }
                .module-list { display: flex; flex-direction: column; gap: 12px; }
                .module-btn { 
                    display: flex; align-items: center; gap: 16px; padding: 16px; border-radius: 16px;
                    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
                    color: #fff; cursor: pointer; transition: all 0.2s; text-align: left;
                }
                .module-btn:hover { background: rgba(255,255,255,0.05); border-color: #6366f1; }
                .module-btn.active { background: rgba(99, 102, 241, 0.1); border-color: #6366f1; box-shadow: 0 0 20px rgba(99, 102, 241, 0.1); }
                .m-num { width: 32px; height: 32px; background: #0f172a; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #6366f1; }
                .m-info { flex: 1; }
                .m-info h4 { font-size: 14px; margin-bottom: 2px; }
                .m-info span { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700; }

                .learn-content { overflow-y: auto; }
                .article-card { padding: 48px; border-radius: 24px; }
                .article-header { margin-bottom: 40px; }
                .module-viewer { 
                  padding: 40px; grid-column: 1 / -1; background: #0f172a; border-radius: 24px; 
                  border: 1px solid rgba(255,255,255,0.05); min-height: 400px; z-index: 10;
                }
                .back-btn { 
                  background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); 
                  color: #6366f1; padding: 10px 20px; border-radius: 100px; font-weight: 700; 
                  cursor: pointer; display: flex; align-items: center; gap: 8px; margin-bottom: 24px;
                }
                .module-viewer h2 { font-size: 26px; font-weight: 800; margin-bottom: 24px; color: #fff; }
                .module-content-scroll { max-height: 450px; overflow-y: auto; padding-right: 16px; margin-bottom: 24px; }
                .content-sec { margin-bottom: 32px; border-left: 2px solid #10b981; padding-left: 20px; }
                .content-sec h4 { font-size: 18px; color: #10b981; margin-bottom: 8px; font-weight: 700; }
                .content-sec p { line-height: 1.8; color: #94a3b8; font-size: 15px; }
                .bubble-content p { margin-bottom: 8px; }
                .bubble-content p:last-child { margin-bottom: 0; }
                .article-footer { margin-top: 48px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.05); }
                .tip-box { display: flex; gap: 16px; padding: 20px; background: rgba(245, 158, 11, 0.05); border-radius: 16px; border-left: 4px solid #f59e0b; }
                .tip-box p { font-size: 14px; color: #d97706; }
            `}</style>
        </motion.div>
    );
};

const SettingsView = ({ userData }) => (
    <div className="settings-container">
        <div className="glass-card settings-card">
            <div className="card-header">
                <Settings size={24} color="#6366f1" />
                <h2>Personalization & Security</h2>
            </div>
            <div className="settings-split">
                <div className="s-section">
                    <h3>Account Profile</h3>
                    <div className="s-box">
                        <UserIcon size={20} />
                        <div>
                            <h4>{userData?.full_name}</h4>
                            <span>{userData?.email}</span>
                        </div>
                    </div>
                </div>
                <div className="s-section">
                    <h3>API Connectivity</h3>
                    <div className="api-status">
                        <div className="status-node">
                            <span>Finnhub Cloud</span>
                            <div className="dot green"></div>
                        </div>
                        <div className="status-node">
                            <span>Alpha Vantage</span>
                            <div className="dot green"></div>
                        </div>
                        <div className="status-node">
                            <span>TradeMind Core</span>
                            <div className="dot green"></div>
                        </div>
                    </div>
                    <button className="btn-primary" style={{ width: '100%', marginTop: '20px' }}>Refresh Connections</button>
                </div>
            </div>
        </div>
        <style jsx>{`
            .settings-card { padding: 40px; max-width: 900px; }
            .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; }
            .card-header h2 { font-size: 24px; font-weight: 800; }
            
            .settings-split { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
            .s-section h3 { font-size: 14px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 1px; }
            
            .s-box { padding: 20px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; display: flex; align-items: center; gap: 16px; }
            .s-box h4 { font-size: 18px; font-weight: 700; }
            .s-box span { font-size: 13px; color: #64748b; }
            
            .api-status { display: flex; flex-direction: column; gap: 16px; }
            .status-node { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(255,255,255,0.02); border-radius: 12px; }
            .status-node span { font-size: 14px; font-weight: 600; }
            .dot { width: 8px; height: 8px; border-radius: 50%; }
            .dot.green { background: #10b981; box-shadow: 0 0 10px #10b981; }
        `}</style>
    </div>
);

const TradingSikhe = ({ userData, symbol, marketData }) => {
    const [activeTab, setActiveTab] = useState('academy');
    const [portfolio, setPortfolio] = useState({ balance: 0, trades: [] });
    const [progress, setProgress] = useState([]);
    const [quantity, setQuantity] = useState(1);

    const [viewingModule, setViewingModule] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [mentorLoading, setMentorLoading] = useState(false);
    const [userInput, setUserInput] = useState("");

    useEffect(() => {
        if (userData?.email) {
            setChatMessages([{
                role: 'ai',
                text: `Namaste ${userData?.full_name?.split(' ')[0]}! I am your AI Mentor. I have analyzed ${symbol} and the indicators show ${marketData?.prediction?.signal || 'Neutral'} sentiment. Do you want me to explain why?`
            }]);
            fetchSimulatorData();
            fetchProgress();
        }
    }, [userData?.email, symbol]);

    const fetchSimulatorData = async () => {
        try {
            const res = await axios.get(`/api/simulator/portfolio/${userData.email}`);
            setPortfolio(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchProgress = async () => {
        try {
            const res = await axios.get(`/api/learning/progress/${userData.email}`);
            setProgress(res.data.completed_modules || []);
        } catch (err) { console.error(err); }
    };

    const handleTrade = async (type) => {
        if (!marketData?.price) {
            toast.error("Market price not available");
            return;
        }
        if (!quantity || quantity <= 0) {
            toast.error("Please enter a valid quantity");
            return;
        }

        try {
            await axios.post('/api/simulator/trade', {
                user_email: userData.email,
                symbol: symbol,
                type: type,
                quantity: parseInt(quantity),
                price: marketData.price
            });
            toast.success(`${type} Successful!`);
            fetchSimulatorData();
        } catch (err) {
            const msg = err.response?.data?.detail || "Trade Failed";
            toast.error(msg);
        }
    };

    const markComplete = async (mid) => {
        await axios.post(`/api/learning/complete/${mid}?email=${userData.email}`);
        toast.success("Module Completed! +10 XP");
        fetchProgress();
    };

    const sendMentorMessage = async (msg = userInput) => {
        if (!msg.trim()) return;

        const newMsgs = [...chatMessages, { role: 'user', text: msg }];
        setChatMessages(newMsgs);
        setUserInput("");
        setMentorLoading(true);

        try {
            const res = await axios.post('/api/mentor/chat', {
                user_email: userData.email,
                message: msg,
                context: {
                    symbol: symbol,
                    price: marketData?.price,
                    indicators: marketData?.indicators,
                    prediction: marketData?.prediction
                }
            });
            setChatMessages([...newMsgs, { role: 'ai', text: res.data.text }]);
        } catch (err) {
            toast.error("Mentor is busy. Try again later.");
        } finally {
            setMentorLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sikhe-container">
            <div className="sikhe-header glass-card">
                <div className="h-left">
                    <GraduationCap size={32} color="#10b981" />
                    <div>
                        <h1>Trading Sikhe <span className="beta-tag">PRO</span></h1>
                        <p>Learn, Practice & Master Trading</p>
                    </div>
                </div>
                <div className="sikhe-tabs">
                    <button className={activeTab === 'academy' ? 'active' : ''} onClick={() => setActiveTab('academy')}>Academy</button>
                    <button className={activeTab === 'simulator' ? 'active' : ''} onClick={() => setActiveTab('simulator')}>Live Simulator</button>
                </div>
            </div>

            <div className="sikhe-main">
                {activeTab === 'academy' && (
                    <div className="academy-grid">
                        {viewingModule ? (
                            <div className="glass-card module-viewer">
                                <button className="back-btn" onClick={() => setViewingModule(null)}><ChevronRight style={{ transform: 'rotate(180deg)' }} /> Back to Roadmap</button>
                                <h2>{viewingModule.title}</h2>
                                <div className="module-content-scroll">
                                    {viewingModule.content.map((c, i) => (
                                        <div key={i} className="content-sec">
                                            <h4>{c.heading}</h4>
                                            <p>{c.body}</p>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-primary" onClick={() => markComplete(viewingModule.id)}>Mark as Completed</button>
                            </div>
                        ) : (
                            learningModules.map((m) => (
                                <div key={m.id} className="glass-card module-card-sikhe">
                                    <div className="m-icon-box">{progress.includes(m.id) ? <CheckCircle color="#10b981" /> : <BookOpen color="#6366f1" />}</div>
                                    <h3>{m.title}</h3>
                                    <p>{m.content[0].body.substring(0, 80)}...</p>
                                    <div className="m-footer-btns">
                                        <button className="btn-outline" onClick={() => setViewingModule(m)}>Start Learning</button>
                                        {progress.includes(m.id) && <span className="status-badge-si">Completed</span>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'simulator' && (
                    <div className="simulator-view">
                        <div className="sim-stats">
                            <div className="glass-card s-stat">
                                <span>Virtual Balance</span>
                                <h2>${portfolio.balance?.toLocaleString()}</h2>
                            </div>
                            <div className="glass-card s-stat">
                                <span>Total P/L</span>
                                <h2 style={{ color: portfolio.total_pnl >= 0 ? '#10b981' : '#f43f5e' }}>
                                    ${portfolio.total_pnl?.toFixed(2)}
                                </h2>
                            </div>
                        </div>

                        <div className="sim-action-grid">
                            <div className="glass-card trade-console">
                                <h3>Practice Trade: {symbol}</h3>
                                <div className="p-display">${marketData?.price?.toFixed(2)}</div>
                                <div className="qty-input">
                                    <label>Quantity</label>
                                    <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                                </div>
                                <div className="trade-btns">
                                    <button className="buy-btn" onClick={() => handleTrade('BUY')}>Buy (Practice)</button>
                                    <button className="sell-btn" onClick={() => handleTrade('SELL')}>Sell (Practice)</button>
                                </div>
                                <p className="disclaimer">Note: This is virtual money. No real money involved.</p>
                            </div>

                            <div className="glass-card history-box">
                                <h3>Trade Journal</h3>
                                <div className="history-list">
                                    {portfolio.trades?.map((t, i) => (
                                        <div key={i} className="history-item">
                                            <span className={`t-type ${t.type.toLowerCase()}`}>{t.type}</span>
                                            <span className="t-symbol">{t.symbol}</span>
                                            <span className="t-qty">{t.quantity} Units</span>
                                            <span className="t-price">${t.entry_price || t.exit_price}</span>
                                        </div>
                                    ))}
                                    {(!portfolio.trades || portfolio.trades.length === 0) && <p className="no-trades">No practice trades yet. Start simulated trading!</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .sikhe-container { display: flex; flex-direction: column; gap: 24px; }
                .sikhe-header { padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; }
                .h-left { display: flex; align-items: center; gap: 16px; }
                .h-left h1 { font-size: 24px; font-weight: 800; }
                .beta-tag { font-size: 10px; background: #6366f1; color: #fff; padding: 2px 6px; border-radius: 4px; vertical-align: middle; }
                
                .sikhe-tabs { display: flex; gap: 8px; background: rgba(255,255,255,0.03); padding: 4px; border-radius: 12px; }
                .sikhe-tabs button { padding: 8px 16px; border-radius: 8px; border: none; background: transparent; color: #94a3b8; font-weight: 700; cursor: pointer; transition: 0.2s; }
                .sikhe-tabs button.active { background: #10b981; color: #fff; }

                .module-viewer { 
                  padding: 40px; grid-column: 1 / -1; background: #0f172a; border-radius: 24px; 
                  border: 1px solid rgba(255,255,255,0.05); min-height: 400px; z-index: 10;
                }
                .back-btn { 
                  background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); 
                  color: #6366f1; padding: 10px 20px; border-radius: 100px; font-weight: 700; 
                  cursor: pointer; display: flex; align-items: center; gap: 8px; margin-bottom: 24px;
                }
                .module-viewer h2 { font-size: 26px; font-weight: 800; margin-bottom: 24px; color: #fff; }
                .module-content-scroll { max-height: 450px; overflow-y: auto; padding-right: 16px; margin-bottom: 24px; }
                .content-sec { margin-bottom: 32px; border-left: 2px solid #10b981; padding-left: 20px; }
                .content-sec h4 { font-size: 18px; color: #10b981; margin-bottom: 8px; font-weight: 700; }
                .content-sec p { line-height: 1.8; color: #94a3b8; font-size: 15px; }

                .academy-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
                .module-card-sikhe { padding: 24px; border-radius: 20px; }
                .m-icon-box { margin-bottom: 16px; }
                .module-card-sikhe h3 { margin-bottom: 12px; font-size: 18px; }
                .module-card-sikhe p { font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 20px; }
                
                .simulator-view { display: flex; flex-direction: column; gap: 24px; }
                .sim-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
                .s-stat { padding: 24px; border-radius: 20px; }
                .s-stat span { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 700; }
                
                .sim-action-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px; }
                .trade-console { padding: 32px; text-align: center; border-radius: 24px; }
                .p-display { font-size: 32px; font-weight: 800; color: #10b981; margin: 16px 0; }
                .qty-input { margin-bottom: 24px; }
                .qty-input label { display: block; margin-bottom: 8px; font-size: 12px; color: #64748b; font-weight: 700; }
                .qty-input input { background: #0d1117; border: 1px solid rgba(255,255,255,0.1); padding: 12px; border-radius: 8px; color: #fff; width: 100px; text-align: center; }
                .trade-btns { display: flex; gap: 16px; }
                .buy-btn { flex: 1; padding: 16px; border: none; border-radius: 12px; color: #fff; font-weight: 800; cursor: pointer; background: #10b981; }
                .sell-btn { flex: 1; padding: 16px; border: none; border-radius: 12px; color: #fff; font-weight: 800; cursor: pointer; background: #f43f5e; }
                .disclaimer { font-size: 11px; color: #475569; margin-top: 20px; }

                .history-box { padding: 24px; border-radius: 20px; }
                .history-list { display: flex; flex-direction: column; gap: 12px; max-height: 380px; overflow-y: auto; padding-right: 8px; }
                .history-item { display: flex; justify-content: space-between; padding: 16px; background: rgba(255,255,255,0.02); border-radius: 12px; font-size: 13px; }
                .t-type { font-weight: 800; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; font-size: 10px; }
                .t-type.buy { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                .t-type.sell { background: rgba(244, 63, 94, 0.1); color: #f43f5e; }
                .no-trades { color: #475569; text-align: center; padding-top: 40px; }

                .mentor-view { padding: 0; max-width: 900px; border-radius: 24px; overflow: hidden; display: flex; flex-direction: column; height: 600px; }
                .mentor-header { padding: 24px 32px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 12px; }
                .mentor-chat-container { flex: 1; display: flex; flex-direction: column; overflow: hidden; padding: 24px; }
                .chat-messages-scroll { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; padding-bottom: 20px; }
                
                .chat-bubble { max-width: 80%; padding: 16px 20px; border-radius: 20px; font-size: 14px; line-height: 1.6; }
                .chat-bubble.ai { align-self: flex-start; background: rgba(99, 102, 241, 0.1); border-left: 4px solid #6366f1; color: #fff; border-bottom-left-radius: 4px; }
                .chat-bubble.user { align-self: flex-end; background: #6366f1; color: #fff; border-bottom-right-radius: 4px; }
                .chat-bubble.ai.loading { display: flex; gap: 4px; padding: 12px 20px; }
                .chat-bubble.ai.loading span { width: 6px; height: 6px; background: #6366f1; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
                .chat-bubble.ai.loading span:nth-child(2) { animation-delay: 0.2s; }
                .chat-bubble.ai.loading span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

                .mentor-options { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
                .opt-btn { padding: 8px 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 100px; color: #94a3b8; cursor: pointer; transition: 0.2s; font-size: 12px; font-weight: 600; }
                .opt-btn:hover { background: rgba(99, 102, 241, 0.2); border-color: #6366f1; color: #fff; }
                
                .chat-input-area { display: flex; gap: 12px; background: rgba(255,255,255,0.02); padding: 16px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
                .chat-input-area input { flex: 1; background: transparent; border: none; color: #fff; font-size: 14px; outline: none; }
                .send-btn { padding: 10px 24px; background: #6366f1; color: #fff; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.2s; }
                .send-btn:hover { background: #4f46e5; transform: translateY(-2px); }
                
                .bubble-content p { margin-bottom: 8px; }
                .bubble-content p:last-child { margin-bottom: 0; }
            `}</style>
        </motion.div>
    );
};

const FloatingMentor = ({ userData, symbol, marketData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                role: 'ai',
                text: `Welcome! I am your AI Mentor. I see you are tracking ${symbol}. How can I assist your learning today?`
            }]);
        }
    }, [isOpen, symbol]);

    const sendMessage = async (msg = input) => {
        if (!msg.trim()) return;
        const newMsgs = [...messages, { role: 'user', text: msg }];
        setMessages(newMsgs);
        setInput("");
        setLoading(true);

        try {
            const res = await axios.post('/api/mentor/chat', {
                user_email: userData.email,
                message: msg,
                context: {
                    symbol: symbol,
                    price: marketData?.price,
                    indicators: marketData?.indicators,
                    prediction: marketData?.prediction
                }
            });
            setMessages([...newMsgs, { role: 'ai', text: res.data.text }]);
        } catch (err) { } finally { setLoading(false); }
    };

    return (
        <div className="floating-mentor-wrapper">
            <button className={`mentor-fab ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <div className="fab-glow"></div>
                <GraduationCap size={28} color="#fff" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="mentor-window glass-card">
                        <div className="mentor-window-header">
                            <div className="m-title">
                                <Zap size={18} color="#6366f1" />
                                <h3>TradeMind Mentor</h3>
                            </div>
                            <button className="close-mentor" onClick={() => setIsOpen(false)}><ChevronRight style={{ transform: 'rotate(90deg)' }} /></button>
                        </div>

                        <div className="mentor-window-chat">
                            {messages.map((m, i) => (
                                <div key={i} className={`chat-line ${m.role}`}>
                                    <div className="bubble">
                                        {m.text.split('\n').map((t, ti) => <p key={ti}>{t}</p>)}
                                    </div>
                                </div>
                            ))}
                            {loading && <div className="chat-line ai loading-dots"><span>.</span><span>.</span><span>.</span></div>}
                        </div>

                        <div className="mentor-window-footer">
                            <div className="mentor-quick-btns">
                                <button onClick={() => sendMessage("Explain Indicators")}>Indicators</button>
                                <button onClick={() => sendMessage("Risk Check")}>Risk Tip</button>
                            </div>
                            <div className="mentor-input">
                                <input type="text" placeholder="Ask your mentor..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} />
                                <button onClick={() => sendMessage()}><TrendingUp size={18} /></button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .floating-mentor-wrapper { position: fixed; bottom: 40px; right: 40px; z-index: 9999; }
                .mentor-fab { 
                    width: 70px; height: 70px; border-radius: 50%; background: #6366f1; border: none; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; position: relative; box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .mentor-fab:hover { transform: scale(1.1) rotate(5deg); }
                .mentor-fab.active { transform: scale(0.9) rotate(-90deg); background: #f43f5e; box-shadow: 0 8px 32px rgba(244, 63, 94, 0.4); }
                .fab-glow { position: absolute; inset: -4px; border-radius: 50%; background: linear-gradient(45deg, #6366f1, #a855f7); opacity: 0.4; filter: blur(8px); animation: spin 4s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .mentor-window { 
                    position: absolute; bottom: 85px; right: 0; width: 380px; height: 550px; 
                    display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 24px 64px rgba(0,0,0,0.4);
                    border: 1px solid rgba(255,255,255,0.1); border-radius: 24px;
                }
                .mentor-window-header { padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .m-title { display: flex; align-items: center; gap: 10px; }
                .m-title h3 { font-size: 16px; font-weight: 800; }
                .close-mentor { background: transparent; border: none; color: #64748b; cursor: pointer; }

                .mentor-window-chat { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
                .chat-line { display: flex; flex-direction: column; max-width: 85%; }
                .chat-line.ai { align-self: flex-start; }
                .chat-line.user { align-self: flex-end; }
                .bubble { padding: 12px 16px; border-radius: 16px; font-size: 13px; line-height: 1.6; }
                .ai .bubble { background: rgba(99, 102, 241, 0.1); color: #fff; border-bottom-left-radius: 4px; border-left: 3px solid #6366f1; }
                .user .bubble { background: #6366f1; color: #fff; border-bottom-right-radius: 4px; }
                .loading-dots { font-weight: 800; color: #6366f1; font-size: 24px; }

                .mentor-window-footer { padding: 20px; border-top: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2); }
                .mentor-quick-btns { display: flex; gap: 8px; margin-bottom: 16px; }
                .mentor-quick-btns button { padding: 6px 12px; border-radius: 100px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; font-size: 11px; font-weight: 600; cursor: pointer; }
                .mentor-quick-btns button:hover { background: rgba(99, 102, 241, 0.2); color: #fff; }

                .mentor-input { display: flex; gap: 10px; background: #0d1117; padding: 8px 8px 8px 16px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.05); }
                .mentor-input input { flex: 1; background: transparent; border: none; color: #fff; font-size: 13px; outline: none; }
                .mentor-input button { width: 32px; height: 32px; border-radius: 10px; background: #6366f1; border: none; color: #fff; cursor: pointer; }
            `}</style>
        </div>
    );
};

export default Dashboard;
