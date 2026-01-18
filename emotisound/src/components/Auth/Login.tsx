import React, { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';

interface LoginProps {
    onLogin: (email: string, password: string) => Promise<void>;
    loading?: boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin, loading = false }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await onLogin(email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
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
                <div style={{ position: "relative" }}>
                    <Mail style={{
                        position: "absolute",
                        left: "1rem",
                        top: "0.875rem",
                        color: "#9ca3af",
                        width: "20px",
                        height: "20px",
                    }} size={20} />
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            paddingLeft: "2.75rem",
                            paddingRight: "1rem",
                            paddingTop: "0.75rem",
                            paddingBottom: "0.75rem",
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
            </div>

            <div>
                <label htmlFor="password" style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#1a281f",
                    marginBottom: "0.5rem",
                }}>
                    Password
                </label>
                <div style={{ position: "relative" }}>
                    <Lock style={{
                        position: "absolute",
                        left: "1rem",
                        top: "0.875rem",
                        color: "#9ca3af",
                        width: "20px",
                        height: "20px",
                    }} size={20} />
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            paddingLeft: "2.75rem",
                            paddingRight: "1rem",
                            paddingTop: "0.75rem",
                            paddingBottom: "0.75rem",
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
            </div>

            <button
                type="submit"
                disabled={loading}
                style={{
                    width: "100%",
                    backgroundColor: loading ? "#d1d5db" : "#6D28D9",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    padding: "0.875rem 1rem",
                    borderRadius: "8px",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                    marginTop: "0.5rem",
                }}
                onMouseOver={(e) => {
                    if (!loading) {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#5b21b6";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(109, 40, 217, 0.3)";
                    }
                }}
                onMouseOut={(e) => {
                    if (!loading) {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#6D28D9";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                    }
                }}
            >
                {loading ? 'Logging in...' : 'Log In'}
            </button>
        </form>
    );
};
