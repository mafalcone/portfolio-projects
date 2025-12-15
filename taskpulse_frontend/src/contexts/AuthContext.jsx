import React, { createContext, useContext, useMemo, useState } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  async function login(email, password) {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res?.data || {};

      if (!data.accessToken) throw new Error("No accessToken returned");

      localStorage.setItem("accessToken", data.accessToken);
      setAccessToken(data.accessToken);
      setUser(data.user || { email });

      return data;
    } catch (err) {
      setAuthError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Login failed"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setUser(null);
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
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
