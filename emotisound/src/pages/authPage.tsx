import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Login } from '../components/Auth/Login';
import { Register } from '../components/Auth/Register';
import { login, register } from '../services/api';
import type { User } from '../types';

const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .auth-form-container {
    animation: fadeIn 0.5s ease-out;
  }
`;

interface AuthPageProps {
    onAuthSuccess: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (email: string, password: string) => {
        setLoading(true);
        try {
            const user = await login(email, password);
            onAuthSuccess(user);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (email: string, password: string) => {
        setLoading(true);
        try {
            // For quick MVP, reuse email as name if none provided
            const name = email.split('@')[0];
            const user = await register(name, email, password);
            onAuthSuccess(user);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{styles}</style>
            <div
                style={{
                    display: "flex",
                    minHeight: "100vh",
                    backgroundColor: "#ffffff",
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    overflow: "hidden",
                }}
            >
                {/* Left Side - Gradient Sidebar */}
                <div
                    style={{
                        flex: 1,
                        background: "linear-gradient(135deg, #6D28D9 0%, #1a281f 100%)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        padding: "4rem 3rem",
                        color: "#ffffff",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "2.5rem",
                            fontWeight: 700,
                            marginBottom: "1.5rem",
                            lineHeight: 1.2,
                        }}
                    >
                        EmotiSound
                    </h1>
                    <p
                        style={{
                            fontSize: "1.1rem",
                            marginBottom: "2rem",
                            maxWidth: "400px",
                            lineHeight: 1.6,
                            color: "#ffffff",
                            opacity: 0.95,
                        }}
                    >
                        Detect emotions in real-time and bring your conversations to life with personalized audio feedback.
                    </p>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                            marginTop: "auto",
                        }}
                    >
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <div style={{ width: "8px", height: "8px", backgroundColor: "#ffffff", borderRadius: "50%" }} />
                            <span style={{ fontSize: "0.95rem" }}>Real-time emotion detection</span>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <div style={{ width: "8px", height: "8px", backgroundColor: "#ffffff", borderRadius: "50%" }} />
                            <span style={{ fontSize: "0.95rem" }}>Personalized audio feedback</span>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <div style={{ width: "8px", height: "8px", backgroundColor: "#ffffff", borderRadius: "50%" }} />
                            <span style={{ fontSize: "0.95rem" }}>Secure & private calls</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "3rem",
                        backgroundColor: "#f8f9fa",
                    }}
                >
                    <div
                        className="auth-form-container"
                        style={{
                            width: "100%",
                            maxWidth: "420px",
                        }}
                    >
                        {/* Mode Toggle */}
                        <div
                            style={{
                                display: "flex",
                                gap: "0.5rem",
                                marginBottom: "2rem",
                                backgroundColor: "#ffffff",
                                padding: "0.5rem",
                                borderRadius: "12px",
                                border: "1px solid #e0e0e0",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                            }}
                        >
                            <button
                                onClick={() => setMode('login')}
                                style={{
                                    flex: 1,
                                    padding: "0.75rem 1rem",
                                    fontSize: "0.95rem",
                                    fontWeight: 600,
                                    border: "none",
                                    borderRadius: "8px",
                                    backgroundColor: mode === 'login' ? "#6D28D9" : "transparent",
                                    color: mode === 'login' ? "#ffffff" : "#5a6b6b",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => setMode('register')}
                                style={{
                                    flex: 1,
                                    padding: "0.75rem 1rem",
                                    fontSize: "0.95rem",
                                    fontWeight: 600,
                                    border: "none",
                                    borderRadius: "8px",
                                    backgroundColor: mode === 'register' ? "#6D28D9" : "transparent",
                                    color: mode === 'register' ? "#ffffff" : "#5a6b6b",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Form Card */}
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "16px",
                                border: "1px solid #e0e0e0",
                                padding: "2rem",
                                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                                marginBottom: "1.5rem",
                            }}
                        >
                            {/* Form Title */}
                            <h2
                                style={{
                                    fontSize: "1.5rem",
                                    fontWeight: 700,
                                    color: "#1a281f",
                                    marginBottom: "0.5rem",
                                    textAlign: "center",
                                }}
                            >
                                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p
                                style={{
                                    fontSize: "0.9rem",
                                    color: "#5a6b6b",
                                    textAlign: "center",
                                    marginBottom: "1.5rem",
                                }}
                            >
                                {mode === 'login'
                                    ? 'Log in to your account to start connecting'
                                    : 'Join EmotiSound and start your first call'}
                            </p>

                            {/* Form */}
                            {mode === 'login' ? (
                                <Login onLogin={handleLogin} loading={loading} />
                            ) : (
                                <Register onRegister={handleRegister} loading={loading} />
                            )}
                        </div>

                        {/* Toggle Link */}
                        <p
                            style={{
                                textAlign: "center",
                                fontSize: "0.9rem",
                                color: "#5a6b6b",
                                marginTop: "1.5rem",
                            }}
                        >
                            {mode === 'login' ? 'New here? ' : 'Already have an account? '}
                            <button
                                type="button"
                                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#6D28D9",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    textDecoration: "none",
                                    fontSize: "0.9rem",
                                }}
                            >
                                {mode === 'login' ? 'Create an account' : 'Log in instead'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuthPage;
