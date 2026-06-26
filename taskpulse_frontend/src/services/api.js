import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "";

function makeDemoApi() {
  const readTasks = () => {
    const saved = localStorage.getItem("taskpulse_demo_tasks");
    if (saved) return JSON.parse(saved);
    const tasks = [
      { id: "demo-1", title: "Review production alerts", done: true },
      { id: "demo-2", title: "Check backup status", done: false },
      { id: "demo-3", title: "Document troubleshooting steps", done: false },
    ];
    localStorage.setItem("taskpulse_demo_tasks", JSON.stringify(tasks));
    return tasks;
  };

  const saveTasks = (tasks) =>
    localStorage.setItem("taskpulse_demo_tasks", JSON.stringify(tasks));

  const response = (data) => Promise.resolve({ data });

  return {
    get: async (path) => {
      if (path === "/tasks") return response({ tasks: readTasks(), mode: "demo" });
      return response({ mode: "demo" });
    },
    post: async (path, payload = {}) => {
      if (path === "/auth/register" || path === "/auth/login") {
        localStorage.setItem("accessToken", "demo");
        return response({ accessToken: "demo", user: { email: payload.email }, mode: "demo" });
      }
      if (path === "/tasks") {
        const tasks = readTasks();
        const task = { id: String(Date.now()), title: payload.title, done: false };
        const next = [task, ...tasks];
        saveTasks(next);
        return response({ task, tasks: next, mode: "demo" });
      }
      return response({ mode: "demo" });
    },
    put: async (path, payload = {}) => {
      const id = path.split("/").pop();
      const tasks = readTasks().map((task) =>
        String(task.id || task._id) === String(id)
          ? { ...task, done: Boolean(payload.done ?? payload.completed) }
          : task
      );
      saveTasks(tasks);
      return response({ tasks, mode: "demo" });
    },
    delete: async (path) => {
      const id = path.split("/").pop();
      const tasks = readTasks().filter((task) => String(task.id || task._id) !== String(id));
      saveTasks(tasks);
      return response({ tasks, mode: "demo" });
    },
  };
}

function makeLiveApi() {
  const client = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return client;
}

export const api = baseURL ? makeLiveApi() : makeDemoApi();

if (!baseURL) {
  console.info("TaskPulse running in demo mode. Set VITE_API_BASE_URL to use a live backend.");
}
