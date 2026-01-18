import React, { useState } from 'react';
import { AlertCircle, Info } from 'lucide-react'; // npm install lucide-react

interface RegisterProps {
    onRegister: (email: string, password: string) => Promise<void>;
    loading?: boolean;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, loading = false }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [passwordMismatch, setPasswordMismatch] = useState(false);

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        setPasswordMismatch(!(value && confirmPassword && value !== confirmPassword));
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        setPasswordMismatch(!!(password && value && password !== value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        try {
            await onRegister(email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
            {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                    <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
                <Info size={20} className="mt-0.5 flex-shrink-0" />
                <span>Your facial data is never stored. We only track emotion detection counts.</span>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password (min. 8 characters)
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => handlePasswordChange(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                />
            </div>

            <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                </label>
                <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={e => handleConfirmPasswordChange(e.target.value)}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${passwordMismatch
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                        }`}
                    placeholder="••••••••"
                />
                {passwordMismatch && <p className="text-red-600 text-sm mt-1">Passwords do not match</p>}
            </div>

            <button
                type="submit"
                disabled={loading || passwordMismatch}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition"
            >
                {loading ? 'Creating Account...' : 'Create Account'}
            </button>
        </form>
    );
};
