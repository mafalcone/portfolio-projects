import React, { useEffect, useMemo, useState } from "react";
import { api } from "../services/api.js";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const doneCount = useMemo(() => items.filter(t => t.done).length, [items]);

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
      setError(e?.response?.data?.error || e?.message || "Error cargando tareas");
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
      await api.post("/tasks", { title: title.trim() });
      setTitle("");
      await load();
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Error creando tarea");
    } finally {
      setBusy(false);
    }
  }

  async function toggleTask(t) {
    setBusy(true);
    setError(null);
    try {
      // soporta backends que usen done/ completed
      const payload = { done: !t.done, completed: !t.done };
      await api.put(`/tasks/${t._id || t.id}`, payload);
      await load();
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Error actualizando");
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
      setError(e?.response?.data?.error || e?.message || "Error borrando");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              {items.length} tareas • {doneCount} hechas
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-sm hover:bg-slate-700"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-xl p-5">
          <form onSubmit={addTask} className="flex gap-2">
            <input
              className="flex-1 rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-600"
              placeholder="Nueva tarea…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button
              disabled={busy}
              className="rounded-xl bg-white text-slate-900 font-medium px-4 py-2 disabled:opacity-60"
            >
              {busy ? "..." : "Agregar"}
            </button>
          </form>

          {error && (
            <div className="mt-4 text-sm text-red-300 border border-red-900/40 bg-red-950/30 rounded-xl p-3">
              {error}
            </div>
          )}

          <div className="mt-5">
            {loading ? (
              <p className="text-slate-400">Cargando…</p>
            ) : items.length === 0 ? (
              <p className="text-slate-400">No hay tareas. Agregá la primera.</p>
            ) : (
              <ul className="space-y-2">
                {items.map((t) => (
                  <li
                    key={t._id || t.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2"
                  >
                    <button
                      onClick={() => toggleTask(t)}
                      disabled={busy}
                      className="text-left flex-1"
                      title="Marcar hecha/no hecha"
                    >
                      <span className={t.done ? "line-through text-slate-500" : ""}>
                        {t.title || t.name || "Sin título"}
                      </span>
                    </button>

                    <button
                      onClick={() => delTask(t)}
                      disabled={busy}
                      className="text-xs rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 hover:bg-slate-800 disabled:opacity-60"
                    >
                      Borrar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-4">
          MVP portfolio: login/register + tareas CRUD.
        </p>
      </div>
    </div>
  );
}
