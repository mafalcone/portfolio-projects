import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login, loading, authError } = useAuth();

  const [email, setEmail] = useState("demo@taskpulse.dev");
  const [password, setPassword] = useState("Demo1234!");
  const [localError, setLocalError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setLocalError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim()) {
      setLocalError("Please enter email and password.");
      return;
    }

    try {
      await login(email.trim(), password);
      setSuccess("Logged in ✅ (token stored in memory).");
    } catch (e) {
      // authError se muestra abajo; esto es extra por si viene vacío
      setLocalError("Login failed. Check credentials / API.");
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">TaskPulse</h1>
          <p className="text-sm text-slate-300 mt-1">
            Sign in to manage your tasks.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-200">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-sm text-slate-200">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {(authError || localError) && (
            <div className="rounded-xl border border-red-800/60 bg-red-950/30 px-3 py-2 text-sm text-red-200">
              {authError || localError}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-800/60 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-200">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-100 text-slate-950 font-medium py-2.5 hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="text-xs text-slate-400 pt-1">
            Tip: This is a portfolio demo. Next step we connect to your Railway
            backend.
          </div>
        </form>
      </div>
    </div>
  );
}
