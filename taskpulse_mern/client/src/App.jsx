let token = null;

// Guardar token en memoria
export function setToken(t) {
  token = t;
}

// POST /api/login
export async function login(email) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error('Login failed');
  }

  const data = await res.json();
  setToken(data.token);
  return data;
}

// GET /api/tasks
export async function listTasks() {
  const res = await fetch('/api/tasks', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    throw new Error('Error fetching tasks');
  }

  return res.json();
}

// POST /api/tasks
export async function createTask(title) {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    throw new Error('Error creating task');
  }

  return res.json();
}

// PUT /api/tasks?id=...
export async function updateTask(id, patch) {
  const res = await fetch(`/api/tasks?id=${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(patch),
  });

  if (!res.ok) {
    throw new Error('Error updating task');
  }

  return res.json();
}

// DELETE /api/tasks?id=...
export async function deleteTask(id) {
  const res = await fetch(`/api/tasks?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    throw new Error('Error deleting task');
  }
}

