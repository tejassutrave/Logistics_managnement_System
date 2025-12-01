import { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                onLogin(data.user, data.token);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Unable to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const quickLogin = (role) => {
        if (role === 'admin') {
            setUsername('admin');
            setPassword('admin123');
        } else if (role === 'manager') {
            setUsername('manager');
            setPassword('manager123');
        } else if (role === 'driver') {
            setUsername('driver');
            setPassword('driver123');
        }
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="login-card glass-card animate-slide-up">
                <div className="login-header">
                    <div className="logo">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                            <rect width="48" height="48" rx="12" fill="url(#gradient)" />
                            <path d="M14 18L24 12L34 18V30L24 36L14 30V18Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 18L24 24L34 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M24 24V36" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <defs>
                                <linearGradient id="gradient" x1="0" y1="0" x2="48" y2="48">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#ec4899" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h1>LogisticsPro</h1>
                    <p>Management System</p>
                </div>

                {error && (
                    <div className="error-message animate-slide-right">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="divider">
                    <span>Quick Login</span>
                </div>

                <div className="quick-login-buttons">
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => quickLogin('admin')}
                    >
                        Admin
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => quickLogin('manager')}
                    >
                        Manager
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => quickLogin('driver')}
                    >
                        Driver
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
