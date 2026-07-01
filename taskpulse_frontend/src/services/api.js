import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "";
const useLiveApi = import.meta.env.VITE_USE_LIVE_API === "true" && Boolean(baseURL);

function makeDemoApi() {
  const usersKey = "taskpulse_demo_users";

  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  const makeProof = (email, value) => btoa(`${email}:${value}`);

  const readUsers = () => {
    const saved = localStorage.getItem(usersKey);
    return saved ? JSON.parse(saved) : [];
  };

  const saveUsers = (users) => localStorage.setItem(usersKey, JSON.stringify(users));

  const taskKey = () => `taskpulse_demo_tasks_${localStorage.getItem("userEmail") || "guest"}`;

  const readTasks = () => {
    const saved = localStorage.getItem(taskKey());
    if (saved) return JSON.parse(saved);
    const tasks = [
      { id: "demo-1", title: "Review production alerts", done: true, priority: "high", area: "Operations", dueDate: "Today", owner: "Manuel", notes: "Check active warnings and assign follow-up." },
      { id: "demo-2", title: "Check backup status", done: false, priority: "high", area: "Infrastructure", dueDate: "Today", owner: "Manuel", notes: "Validate last job result and restore point." },
      { id: "demo-3", title: "Document troubleshooting steps", done: false, priority: "medium", area: "Support", dueDate: "Tomorrow", owner: "Team", notes: "Turn repeated incidents into a reusable runbook." },
      { id: "demo-4", title: "Review API error logs", done: false, priority: "medium", area: "Automation", dueDate: "This week", owner: "Manuel", notes: "Group errors by endpoint and frequency." },
    ];
    localStorage.setItem(taskKey(), JSON.stringify(tasks));
    return tasks;
  };

  const saveTasks = (tasks) => localStorage.setItem(taskKey(), JSON.stringify(tasks));
  const response = (data) => Promise.resolve({ data });
  const reject = (message) => Promise.reject({ response: { data: { error: message } }, message });

  return {
    get: async (path) => {
      if (path === "/tasks") return response({ tasks: readTasks(), mode: "demo" });
      return response({ mode: "demo" });
    },
    post: async (path, payload = {}) => {
      if (path === "/auth/register" || path === "/auth/login") {
        const email = String(payload.email || "").trim().toLowerCase();
        const value = String(payload.password || "");

        if (!isEmail(email)) return reject("Enter a valid email address.");
        if (value.length < 6) return reject("Password must have at least 6 characters.");

        if (path === "/auth/register") {
          const users = readUsers();
          if (users.some((user) => user.email === email)) return reject("User already exists. Login instead.");
          saveUsers([{ email, proof: makeProof(email, value) }, ...users]);
          return response({ user: { email }, mode: "demo" });
        }

        const user = readUsers().find((item) => item.email === email);
        if (!user) return reject("User not found. Register first in this demo.");
        if (user.proof !== makeProof(email, value)) return reject("Invalid email or password.");
        const token = `demo-${Date.now()}`;
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userEmail", email);
        return response({ accessToken: token, user: { email }, mode: "demo" });
      }

      if (path === "/tasks") {
        const title = String(payload.title || "").trim();
        if (!title) return reject("Enter a task title.");
        const tasks = readTasks();
        const task = {
          id: String(Date.now()),
          title,
          done: false,
          priority: payload.priority || "medium",
          area: payload.area || "Operations",
          dueDate: payload.dueDate || "This week",
          owner: payload.owner || "Manuel",
          notes: payload.notes || "Added from the public demo dashboard.",
        };
        const next = [task, ...tasks];
        saveTasks(next);
        return response({ task, tasks: next, mode: "demo" });
      }
      return response({ mode: "demo" });
    },
    put: async (path, payload = {}) => {
      const id = path.split("/").pop();
      const tasks = readTasks().map((task) =>
        String(task.id || task._id) === String(id) ? { ...task, ...payload, done: Boolean(payload.done ?? payload.completed ?? task.done) } : task
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
  const client = axios.create({ baseURL, headers: { "Content-Type": "application/json" } });
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  return client;
}

export const api = useLiveApi ? makeLiveApi() : makeDemoApi();

if (!useLiveApi) {
  console.info("TaskPulse running in public demo mode. Set VITE_USE_LIVE_API=true and VITE_API_BASE_URL to use a live backend.");
}
