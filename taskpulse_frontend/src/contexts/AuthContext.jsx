import React, { createContext, useContext, useState } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  async function login(email, password) {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      setUser(res.user);
      setAccessToken(res.accessToken);
    } catch (err) {
      console.error("Login error:", err);
      setAuthError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setAccessToken(null);
  }

  const value = {
    user,
    accessToken,
    loading,
    authError,
    login,
    logout,
    isAuthenticated: !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
