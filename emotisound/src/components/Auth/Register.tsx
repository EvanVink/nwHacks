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
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
            {error && (
                <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    padding: "0.875rem",
                    backgroundColor: "#fee2e2",
                    border: "1px solid #fca5a5",
                    borderRadius: "8px",
                    color: "#991b1b",
                    fontSize: "0.9rem",
                }}>
                    <AlertCircle size={20} style={{ flexShrink: 0, marginTop: "0.125rem" }} />
                    <span>{error}</span>
                </div>
            )}

            <div style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                padding: "0.875rem",
                backgroundColor: "#dbeafe",
                border: "1px solid #93c5fd",
                borderRadius: "8px",
                color: "#1e40af",
                fontSize: "0.85rem",
            }}>
                <Info size={20} style={{ flexShrink: 0, marginTop: "0.125rem" }} />
                <span>Your facial data is never stored. We only track emotion detection counts.</span>
            </div>

            <div>
                <label htmlFor="email" style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#1a281f",
                    marginBottom: "0.5rem",
                }}>
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontSize: "0.95rem",
                        color: "#1a281f",
                        backgroundColor: "#ffffff",
                        transition: "all 0.2s ease",
                        boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#6D28D9";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(109, 40, 217, 0.1)";
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#d1d5db";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                    placeholder="your@email.com"
                />
            </div>

            <div>
                <label htmlFor="password" style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#1a281f",
                    marginBottom: "0.5rem",
                }}>
                    Password (min. 8 characters)
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => handlePasswordChange(e.target.value)}
                    required
                    style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontSize: "0.95rem",
                        color: "#1a281f",
                        backgroundColor: "#ffffff",
                        transition: "all 0.2s ease",
                        boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#6D28D9";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(109, 40, 217, 0.1)";
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#d1d5db";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                    placeholder="••••••••"
                />
            </div>

            <div>
                <label htmlFor="confirm-password" style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#1a281f",
                    marginBottom: "0.5rem",
                }}>
                    Confirm Password
                </label>
                <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={e => handleConfirmPasswordChange(e.target.value)}
                    required
                    style={{
                        width: "100%",
                        padding: "0.75rem 1rem",
                        border: passwordMismatch ? "1px solid #fca5a5" : "1px solid #d1d5db",
                        borderRadius: "8px",
                        fontSize: "0.95rem",
                        color: "#1a281f",
                        backgroundColor: "#ffffff",
                        transition: "all 0.2s ease",
                        boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = passwordMismatch ? "#fca5a5" : "#6D28D9";
                        e.currentTarget.style.boxShadow = passwordMismatch ? "0 0 0 3px rgba(252, 165, 165, 0.1)" : "0 0 0 3px rgba(109, 40, 217, 0.1)";
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = passwordMismatch ? "#fca5a5" : "#d1d5db";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                    placeholder="••••••••"
                />
                {passwordMismatch && <p style={{ color: "#991b1b", fontSize: "0.85rem", marginTop: "0.25rem" }}>Passwords do not match</p>}
            </div>

            <button
                type="submit"
                disabled={loading || passwordMismatch}
                style={{
                    width: "100%",
                    backgroundColor: loading || passwordMismatch ? "#d1d5db" : "#6D28D9",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    padding: "0.875rem 1rem",
                    borderRadius: "8px",
                    border: "none",
                    cursor: loading || passwordMismatch ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    marginTop: "0.5rem",
                }}
                onMouseOver={(e) => {
                    if (!loading && !passwordMismatch) {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#5b21b6";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(109, 40, 217, 0.3)";
                    }
                }}
                onMouseOut={(e) => {
                    if (!loading && !passwordMismatch) {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#6D28D9";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                    }
                }}
            >
                {loading ? 'Creating Account...' : 'Create Account'}
            </button>
        </form>
    );
};
