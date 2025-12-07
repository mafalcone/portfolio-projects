import { createContext, useContext, useState } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  user: "taskpulse_user",
  access: "taskpulse_access",
  refresh: "taskpulse_refresh",
};

const getInitialUser = () => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEYS.user);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    // Si hay basura en localStorage, la limpio para no romper nada
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.access);
    localStorage.removeItem(STORAGE_KEYS.refresh);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosClient.post("/auth/login", { email, password });

      setUser(data.user);

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
        localStorage.setItem(STORAGE_KEYS.access, data.accessToken);
        localStorage.setItem(STORAGE_KEYS.refresh, data.refreshToken);
      }

      return true;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosClient.post("/auth/register", {
        name,
        email,
        password,
      });

      setUser(data.user);

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
        localStorage.setItem(STORAGE_KEYS.access, data.accessToken);
        localStorage.setItem(STORAGE_KEYS.refresh, data.refreshToken);
      }

      return true;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.user);
      localStorage.removeItem(STORAGE_KEYS.access);
      localStorage.removeItem(STORAGE_KEYS.refresh);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
