import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/register", { email, password });
      // después de registrar, te loguea
      await login(email, password);
    } catch (err) {
      setError(err?.response?.data?.error || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-6">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900/40 border border-slate-800 shadow-xl p-6">
        <h1 className="text-xl font-semibold">TaskPulse</h1>
        <p className="text-sm text-slate-400 mt-1">Sign in to manage your tasks.</p>

        <form className="mt-5 space-y-3">
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input
              className="mt-1 w-full rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-300 border border-red-900/40 bg-red-950/30 rounded-xl p-3">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="flex-1 rounded-xl bg-white text-slate-900 font-medium py-2 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="flex-1 rounded-xl bg-slate-800 text-white font-medium py-2 border border-slate-700 disabled:opacity-60"
            >
              Register
            </button>
          </div>
        </form>

        <p className="text-xs text-slate-400 mt-4">
          Tip: Register with your email + password, then login.
        </p>
      </div>
    </div>
  );
}
