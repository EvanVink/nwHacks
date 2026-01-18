import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Login } from '../components/Auth/Login';
import { Register } from '../components/Auth/Register';
import { login, register } from '../services/api';
import type { User } from '../types';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4">
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-8 flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-4">Welcome to EmotiSound</h1>
                            <p className="text-white/80">
                                Detect emotions in real-time and add sound to your conversations. Create an account or log in to start a call.
                            </p>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setMode('login')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === 'login' ? 'bg-white text-purple-700' : 'bg-white/20 text-white'}`}
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => setMode('register')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === 'register' ? 'bg-white text-purple-700' : 'bg-white/20 text-white'}`}
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>

                    <div className="p-8">
                        {mode === 'login' ? (
                            <Login onLogin={handleLogin} loading={loading} />
                        ) : (
                            <Register onRegister={handleRegister} loading={loading} />
                        )}
                        <p className="text-center text-sm text-gray-500 mt-4">
                            {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
                            <button
                                type="button"
                                className="text-purple-600 font-semibold"
                                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                            >
                                {mode === 'login' ? 'Create an account' : 'Log in instead'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
