import Task from '../models/Task.js';

const priorities = new Set(['low', 'medium', 'high']);

function pickCreateFields(body = {}) {
  return {
    title: String(body.title || '').trim(),
    description: String(body.description || '').trim(),
    priority: priorities.has(body.priority) ? body.priority : 'medium',
  };
}

function pickUpdateFields(body = {}) {
  const update = {};

  if (typeof body.title === 'string') update.title = body.title.trim();
  if (typeof body.description === 'string') update.description = body.description.trim();
  if (priorities.has(body.priority)) update.priority = body.priority;
  if (typeof body.completed === 'boolean') update.completed = body.completed;

  return update;
}

export async function getTasks(req, res) {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({ error: 'Could not load tasks' });
  }
}

export async function createTask(req, res) {
  try {
    const data = pickCreateFields(req.body);
    if (!data.title) return res.status(400).json({ error: 'Title is required' });

    const task = await Task.create({ ...data, userId: req.userId });
    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ error: 'Could not create task' });
  }
}

export async function updateTask(req, res) {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      pickUpdateFields(req.body),
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ error: 'Task not found' });
    return res.json(task);
  } catch (error) {
    return res.status(400).json({ error: 'Could not update task' });
  }
}

export async function deleteTask(req, res) {
  try {
    const result = await Task.deleteOne({ _id: req.params.id, userId: req.userId });
    if (!result.deletedCount) return res.status(404).json({ error: 'Task not found' });
    return res.json({ message: 'Deleted' });
  } catch (error) {
    return res.status(400).json({ error: 'Could not delete task' });
  }
}
