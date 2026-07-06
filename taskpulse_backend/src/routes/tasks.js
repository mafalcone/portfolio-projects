import express from 'express';
import authAccess from '../middleware/authAccess.js';
import {getTasks,createTask,updateTask,deleteTask} from '../controllers/tasks.js';

const r=express.Router();
r.get('/', authAccess, getTasks);
r.post('/', authAccess, createTask);
r.put('/:id', authAccess, updateTask);
r.delete('/:id', authAccess, deleteTask);
export default r;
