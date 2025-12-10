import { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext.jsx";
import { api } from "./services/api.js";

function LoginView() {
  const { login, loading, authError } = useAuth();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("demo1234");
  const [localError, setLocalError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);
    try {
      await login(email, password);
    } catch (err) {
      setLocalError(err.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-semibold mb-2 text-center">
          TaskPulse · Sign in
        </h1>
        <p className="text-sm text-slate-400 mb-6 text-center">
          Login to manage your tasks and priorities.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {(authError || localError) && (
            <p className="text-sm text-red-400">
              {authError || localError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/60 px-3 py-2 text-sm font-medium transition-colors"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

function DashboardView() {
  const { user, accessToken, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState(null);

  async function loadTasks() {
    if (!accessToken) return;
    setLoadingTasks(true);
    setError(null);
    try {
      const data = await api.get("/tasks", { token: accessToken });
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      setError(err.message || "Error loading tasks");
    } finally {
      setLoadingTasks(false);
    }
  }

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">TaskPulse · Dashboard</h1>
            <p className="text-xs text-slate-400">
              Logged in as {user?.email || "Unknown"}
            </p>
          </div>
          <button
            onClick={logout}
            className="text-xs px-3 py-1 rounded-lg border border-slate-700 hover:border-red-500 hover:text-red-300 transition-colors"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-slate-200">
            Your tasks
          </h2>
          <button
            onClick={loadTasks}
            className="text-xs px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {loadingTasks && (
          <p className="text-sm text-slate-400 mb-2">Loading tasks...</p>
        )}
        {error && (
          <p className="text-sm text-red-400 mb-2">
            {error}
          </p>
        )}

        {tasks.length === 0 && !loadingTasks && !error && (
          <p className="text-sm text-slate-500">
            No tasks found. Create some tasks with the API to see them here.
          </p>
        )}

        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task._id || task.id}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium text-slate-100">
                  {task.title || "Untitled task"}
                </p>
                {task.description && (
                  <p className="text-xs text-slate-400">
                    {task.description}
                  </p>
                )}
              </div>
              <span className="text-xs px-2 py-1 rounded-full border border-slate-700 text-slate-300">
                {task.status || "pending"}
              </span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <DashboardView /> : <LoginView />;
}
