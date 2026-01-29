import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, TrendingUp, ArrowRight, Eye, EyeOff, BarChart3, PieChart, Activity } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  YAxis
} from 'recharts';

// Mock data for the sidebar graph on login page
const miniChartData = [
  { p: 10 }, { p: 25 }, { p: 15 }, { p: 35 }, { p: 30 }, { p: 45 }, { p: 40 }, { p: 60 }
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('/api/login', { email, password });
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Welcome back, ' + res.data.user.full_name);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed. Check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background Blobs */}
      <div className="bg-animations">
        <div className="blob b1"></div>
        <div className="blob b2"></div>
      </div>

      <div className="login-wrapper">
        {/* Left Side: Professional Analytics Teaser (Hidden on small screens) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="login-info-side"
        >
          <div className="info-content">
            <div className="badge-featured">
              <Activity size={14} /> AI Powered Market Analysis
            </div>
            <h1>Predict the market with <span className="highlight">Precision</span>.</h1>
            <p>Access advanced LSTM neural network predictions and real-time technical indicators in one unified platform.</p>

            <div className="mini-dashboard-preview glass-card">
              <div className="preview-header">
                <BarChart3 size={18} color="#6366f1" />
                <span>Live Intelligence</span>
              </div>
              <div className="preview-chart">
                <ResponsiveContainer width="100%" height={80}>
                  <AreaChart data={miniChartData}>
                    <defs>
                      <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="p" stroke="#6366f1" fill="url(#colorP)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="preview-stats">
                <div className="p-stat"><span>BTC</span> <span className="up">+4.2%</span></div>
                <div className="p-stat"><span>AAPL</span> <span className="up">+1.8%</span></div>
                <div className="p-stat"><span>NVDA</span> <span className="up">+5.7%</span></div>
              </div>
            </div>

            <div className="trust-badges">
              <div className="t-badge"><BarChart3 size={16} /> 98% Accuracy</div>
              <div className="t-badge"><PieChart size={16} /> Data Encryption</div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="login-form-side"
        >
          <div className="glass-card login-card">
            <div className="login-header">
              <div className="logo-circle">
                <TrendingUp size={32} color="#fff" />
              </div>
              <h2>Sign In</h2>
              <p>Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-box">
                  <User size={18} className="icon" />
                  <input
                    type="email"
                    placeholder="demo@trademind.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-box">
                  <Lock size={18} className="icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="forgot-pwd">
                <a href="#">Forgot password?</a>
              </div>

              <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Sign In Now'} <ArrowRight size={18} />
              </button>
            </form>

            <div className="login-footer">
              <p>Don't have an account? <Link to="/register">Create Account</Link></p>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          width: 100vw;
          background: #020617;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        .bg-animations {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .blob {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
          animation: drift 20s infinite alternate;
        }

        .b1 { background: #6366f1; top: -100px; left: -100px; }
        .b2 { background: #ec4899; bottom: -100px; right: -100px; animation-delay: -10s; }

        @keyframes drift {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(100px, 100px) scale(1.1); }
        }

        .login-wrapper {
          width: 100%;
          max-width: 1100px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 60px;
          z-index: 10;
        }

        @media (max-width: 900px) {
          .login-wrapper { grid-template-columns: 1fr; }
          .login-info-side { display: none; }
        }

        .login-info-side {
          display: flex;
          align-items: center;
        }

        .info-content h1 {
          font-size: 48px;
          font-weight: 800;
          line-height: 1.2;
          margin: 20px 0;
        }

        .highlight { color: #6366f1; }

        .info-content p {
          color: var(--text-muted);
          font-size: 18px;
          margin-bottom: 40px;
          max-width: 500px;
        }

        .badge-featured {
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .mini-dashboard-preview {
          padding: 20px;
          width: 300px;
          margin-bottom: 40px;
          background: rgba(15, 23, 42, 0.5);
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 15px;
        }

        .preview-stats {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
          font-size: 11px;
          font-weight: 700;
        }

        .up { color: #10b981; }

        .trust-badges {
          display: flex;
          gap: 30px;
        }

        .t-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--text-muted);
        }

        /* FORM STYLES */
        .login-card {
          padding: 40px;
          width: 100%;
        }

        .logo-circle {
          width: 60px;
          height: 600px;
          max-height: 60px;
          background: #6366f1;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
        }

        .login-header h2 { font-size: 28px; margin-bottom: 8px; }
        .login-header p { color: var(--text-muted); margin-bottom: 32px; }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-muted);
          margin-bottom: 8px;
          display: block;
        }

        .input-box {
          position: relative;
        }

        .input-box .icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .input-box input {
          width: 100%;
          padding: 12px 45px 12px 44px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #fff;
          font-size: 15px;
          transition: all 0.3s;
        }

        .input-box input:focus {
          border-color: #6366f1;
          background: rgba(255, 255, 255, 0.05);
          outline: none;
        }

        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .forgot-pwd {
          text-align: right;
        }

        .forgot-pwd a {
          font-size: 13px;
          color: #6366f1;
        }

        .auth-submit {
          width: 100%;
          margin-top: 10px;
          height: 50px;
          font-size: 16px;
        }

        .login-footer {
          margin-top: 24px;
          text-align: center;
          color: var(--text-muted);
          font-size: 14px;
        }

        .login-footer a {
          color: #6366f1;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default Login;
