import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail, TrendingUp, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirmPwd, setShowConfirmPwd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setIsLoading(true);
        try {
            await axios.post('/api/register', {
                full_name: formData.name,
                email: formData.email,
                password: formData.password
            });
            toast.success("Account created successfully!");
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.detail || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="bg-animations">
                <div className="blob b1"></div>
                <div className="blob b2"></div>
            </div>

            <div className="login-wrapper">
                {/* Left Side: Info */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="login-info-side"
                >
                    <div className="info-content">
                        <div className="badge-featured">
                            <ShieldCheck size={14} /> Secure & Encrypted
                        </div>
                        <h1>Start your <span className="highlight">Analysis</span> journey.</h1>
                        <p>Create an account to unlock institutional-grade trading tools and AI-powered insights.</p>

                        <div className="feature-list">
                            <div className="feature-item">
                                <div className="feat-icon"><TrendingUp size={20} /></div>
                                <div>
                                    <h4>Real-time Tracking</h4>
                                    <p>Live streams for over 5000+ assets.</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <div className="feat-icon"><ShieldCheck size={20} /></div>
                                <div>
                                    <h4>Private & Secure</h4>
                                    <p>Your data is encrypted end-to-end.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Form */}
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
                            <h2>Create Account</h2>
                            <p>Fill in the details to get started</p>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <div className="input-box">
                                    <User size={18} className="icon" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="input-box">
                                    <Mail size={18} className="icon" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="name@company.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <div className="input-box">
                                    <Lock size={18} className="icon" />
                                    <input
                                        type={showPwd ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="eye-btn"
                                        onClick={() => setShowPwd(!showPwd)}
                                    >
                                        {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Confirm Password</label>
                                <div className="input-box">
                                    <Lock size={18} className="icon" />
                                    <input
                                        type={showConfirmPwd ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="eye-btn"
                                        onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                                    >
                                        {showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
                                {isLoading ? 'Creating Account...' : 'Sign Up Now'} <ArrowRight size={18} />
                            </button>
                        </form>

                        <div className="login-footer">
                            <p>Already have an account? <Link to="/login">Sign In</Link></p>
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

                .bg-animations { position: absolute; inset: 0; z-index: 0; }
                .blob {
                    position: absolute; width: 500px; height: 500px; border-radius: 50%;
                    filter: blur(100px); opacity: 0.15; animation: drift 20s infinite alternate;
                }
                .b1 { background: #6366f1; top: -100px; left: -100px; }
                .b2 { background: #ec4899; bottom: -100px; right: -100px; animation-delay: -10s; }

                @keyframes drift {
                    from { transform: translate(0, 0) scale(1); }
                    to { transform: translate(100px, 100px) scale(1.1); }
                }

                .login-wrapper {
                    width: 100%; max-width: 1100px;
                    display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 60px; z-index: 10;
                }

                @media (max-width: 900px) {
                    .login-wrapper { grid-template-columns: 1fr; }
                    .login-info-side { display: none; }
                }

                .info-content h1 { font-size: 48px; font-weight: 800; line-height: 1.2; margin: 20px 0; }
                .highlight { color: #6366f1; }
                .info-content p { color: var(--text-muted); font-size: 18px; margin-bottom: 40px; }

                .badge-featured {
                    background: rgba(99, 102, 241, 0.1); color: #6366f1;
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 6px 16px; border-radius: 100px; font-size: 13px; font-weight: 600;
                    border: 1px solid rgba(99, 102, 241, 0.2);
                }

                .feature-list { display: flex; flex-direction: column; gap: 24px; }
                .feature-item { display: flex; gap: 16px; align-items: flex-start; }
                .feat-icon {
                    width: 40px; height: 40px; background: rgba(99, 102, 241, 0.1);
                    border-radius: 10px; display: flex; align-items: center; justify-content: center;
                    color: #6366f1; flex-shrink: 0;
                }
                .feature-item h4 { margin-bottom: 4px; font-size: 16px; }
                .feature-item p { font-size: 14px; margin-bottom: 0; }

                .login-card { padding: 40px; width: 100%; }
                .logo-circle {
                    width: 60px; height: 60px; background: #6366f1; border-radius: 14px;
                    display: flex; align-items: center; justify-content: center; margin-bottom: 24px;
                }

                .login-header h2 { font-size: 28px; margin-bottom: 8px; }
                .login-header p { color: var(--text-muted); margin-bottom: 32px; }

                .auth-form { display: flex; flex-direction: column; gap: 16px; }
                .form-group label { font-size: 14px; font-weight: 500; color: var(--text-muted); margin-bottom: 8px; display: block; }
                
                .input-box { position: relative; }
                .icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
                .input-box input {
                    width: 100%; padding: 12px 45px 12px 44px; background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; color: #fff;
                }
                .input-box input:focus { border-color: #6366f1; outline: none; }
                
                .eye-btn {
                    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
                    background: none; border: none; color: var(--text-muted); cursor: pointer;
                }

                .auth-submit { width: 100%; margin-top: 10px; height: 50px; }
                .login-footer { margin-top: 24px; text-align: center; color: var(--text-muted); font-size: 14px; }
                .login-footer a { color: #6366f1; font-weight: 600; }
            `}</style>
        </div>
    );
};

export default Register;
