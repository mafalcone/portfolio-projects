import React, { useEffect, useMemo, useState } from "react";
import { api } from "../services/api.js";
import { useNavigate } from "react-router-dom";

const filters = ["all", "open", "done", "high"];
const areas = ["Operations", "Infrastructure", "Support", "Automation"];
const priorities = ["high", "medium", "low"];

function priorityClass(priority) {
  if (priority === "high") return "border-red-500/40 bg-red-500/10 text-red-200";
  if (priority === "medium") return "border-amber-500/40 bg-amber-500/10 text-amber-200";
  return "border-cyan-500/40 bg-cyan-500/10 text-cyan-200";
}

function normalizeTask(task) {
  return {
    ...task,
    priority: task.priority || "medium",
    area: task.area || "Operations",
    dueDate: task.dueDate || "This week",
    owner: task.owner || "Manuel",
    notes: task.notes || "Operational task tracked from the demo dashboard.",
  };
}

export default function Dashboard() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [area, setArea] = useState("Operations");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const normalized = useMemo(() => items.map(normalizeTask), [items]);
  const doneCount = useMemo(() => normalized.filter(t => t.done).length, [normalized]);
  const openCount = normalized.length - doneCount;
  const highCount = useMemo(() => normalized.filter(t => t.priority === "high" && !t.done).length, [normalized]);
  const progress = normalized.length ? Math.round((doneCount / normalized.length) * 100) : 0;

  const visibleItems = useMemo(() => {
    return [...normalized]
      .filter((task) => {
        if (filter === "open") return !task.done;
        if (filter === "done") return task.done;
        if (filter === "high") return task.priority === "high";
        return true;
      })
      .sort((a, b) => {
        const rank = { high: 0, medium: 1, low: 2 };
        if (Boolean(a.done) !== Boolean(b.done)) return a.done ? 1 : -1;
        if (rank[a.priority] !== rank[b.priority]) return rank[a.priority] - rank[b.priority];
        return String(b.id || b._id || "").localeCompare(String(a.id || a._id || ""));
      });
  }, [normalized, filter]);

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    nav("/", { replace: true });
  }

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const r = await api.get("/tasks");
      setItems(r.data?.tasks || r.data || []);
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Error loading tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await api.post("/tasks", {
        title: title.trim(),
        priority,
        area,
        dueDate: priority === "high" ? "Today" : "This week",
        owner: "Manuel",
        notes: `Created as a ${area.toLowerCase()} task from the dashboard demo.`,
      });
      setTitle("");
      await load();
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Error creating task");
    } finally {
      setBusy(false);
    }
  }

  async function toggleTask(t) {
    setBusy(true);
    setError(null);
    try {
      await api.put(`/tasks/${t._id || t.id}`, { ...t, done: !t.done, completed: !t.done });
      await load();
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Error updating task");
    } finally {
      setBusy(false);
    }
  }

  async function delTask(t) {
    setBusy(true);
    setError(null);
    try {
      await api.delete(`/tasks/${t._id || t.id}`);
      await load();
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Error deleting task");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-cyan-300 text-sm font-semibold tracking-wide uppercase">TaskPulse Demo Workspace</p>
            <h1 className="text-3xl font-bold mt-2">Operations Task Command Center</h1>
            <p className="text-slate-400 text-sm mt-2 max-w-2xl">
              Track operational work, prioritize incidents and keep support/infrastructure tasks visible from one dashboard.
            </p>
          </div>
          <button onClick={logout} className="rounded-xl bg-slate-900 border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">Logout</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-7">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-slate-400 text-sm">Open tasks</p><strong className="text-3xl mt-2 block">{openCount}</strong></div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-slate-400 text-sm">Completed</p><strong className="text-3xl mt-2 block">{doneCount}</strong></div>
          <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-5"><p className="text-red-200 text-sm">High priority</p><strong className="text-3xl mt-2 block">{highCount}</strong></div>
          <div className="rounded-2xl border border-cyan-900/40 bg-cyan-950/20 p-5"><p className="text-cyan-200 text-sm">Progress</p><strong className="text-3xl mt-2 block">{progress}%</strong><div className="h-2 rounded-full bg-slate-800 mt-3"><div className="h-2 rounded-full bg-cyan-400" style={{ width: `${progress}%` }} /></div></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[.95fr_1.45fr] gap-5 mt-6">
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 shadow-xl p-5">
            <h2 className="font-semibold text-lg">Create operational task</h2>
            <p className="text-slate-400 text-sm mt-1">Add a support, infrastructure or automation task with context.</p>
            <form onSubmit={addTask} className="mt-5 space-y-3">
              <input className="w-full rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-3 outline-none focus:ring-2 focus:ring-cyan-700" placeholder="Task title…" value={title} onChange={(e) => setTitle(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-3 outline-none">{priorities.map(item => <option key={item} value={item}>{item}</option>)}</select>
                <select value={area} onChange={(e) => setArea(e.target.value)} className="rounded-xl bg-slate-950/70 border border-slate-800 px-3 py-3 outline-none">{areas.map(item => <option key={item} value={item}>{item}</option>)}</select>
              </div>
              <button disabled={busy} className="w-full rounded-xl bg-cyan-300 text-slate-950 font-bold px-4 py-3 disabled:opacity-60 hover:bg-cyan-200">{busy ? "Saving..." : "Add task"}</button>
            </form>
            {error && <div className="mt-4 text-sm text-red-300 border border-red-900/40 bg-red-950/30 rounded-xl p-3">{error}</div>}
          </div>

          <div className="rounded-2xl bg-slate-900/50 border border-slate-800 shadow-xl p-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div><h2 className="font-semibold text-lg">Task queue</h2><p className="text-slate-400 text-sm mt-1">Priority-first operational view.</p></div>
              <div className="flex gap-2 flex-wrap">{filters.map(item => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-3 py-1 text-xs font-bold border ${filter === item ? "bg-white text-slate-950 border-white" : "bg-slate-950/60 border-slate-700 text-slate-300"}`}>{item}</button>)}</div>
            </div>

            <div className="mt-5">
              {loading ? <p className="text-slate-400">Loading…</p> : visibleItems.length === 0 ? <p className="text-slate-400">No tasks for this filter.</p> : <ul className="space-y-3">{visibleItems.map((t) => <li key={t._id || t.id} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4"><div className="flex items-start justify-between gap-4"><button onClick={() => toggleTask(t)} disabled={busy} className="text-left flex-1"><div className="flex items-center gap-2 flex-wrap"><span className={`rounded-full border px-2 py-1 text-[11px] font-bold ${priorityClass(t.priority)}`}>{t.priority}</span><span className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-300">{t.area}</span><span className="text-xs text-slate-500">Due: {t.dueDate}</span></div><h3 className={`mt-3 font-semibold ${t.done ? "line-through text-slate-500" : "text-white"}`}>{t.title || t.name || "Untitled task"}</h3><p className="text-sm text-slate-400 mt-1">{t.notes}</p><p className="text-xs text-slate-500 mt-2">Owner: {t.owner}</p></button><button onClick={() => delTask(t)} disabled={busy} className="text-xs rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 hover:bg-slate-800 disabled:opacity-60">Delete</button></div></li>)}</ul>}
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-5">Portfolio demo: auth flow, local persistence, task metrics, filtering, priority and CRUD behavior.</p>
      </div>
    </div>
  );
}
