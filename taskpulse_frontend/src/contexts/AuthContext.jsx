import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);

function safeJsonParse(v) {
  try { return JSON.parse(v); } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => safeJsonParse(localStorage.getItem("user")) || null);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken") || null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    else localStorage.removeItem("accessToken");
  }, [accessToken]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  async function login(email, password) {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res?.data || {};

      if (!data.accessToken) throw new Error("Login response missing accessToken");

      setUser(data.user || { email });
      setAccessToken(data.accessToken);

      return data;
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Login failed";
      setAuthError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setAccessToken(null);
    setAuthError(null);
  }

  const value = useMemo(
    () => ({
      user,
      accessToken,
      loading,
      authError,
      login,
      logout,
      isAuthenticated: !!accessToken,
    }),
    [user, accessToken, loading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
