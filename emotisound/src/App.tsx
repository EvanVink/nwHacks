import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import CallPage from "./pages/callPage";
import AuthPage from "./pages/authPage";
import type { User } from "./types";

const STORAGE_KEY = "emotisound:user";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const handleAuthSuccess = (nextUser: User) => {
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage user={user} onLogout={handleLogout} />} />
        <Route
          path="/call"
          element={user ? <CallPage user={user} /> : <Navigate to="/auth" replace />}
        />
        <Route path="/auth" element={<AuthPage onAuthSuccess={handleAuthSuccess} />} />
      </Routes>
    </Router>
  );
};

export default App;
