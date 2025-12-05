app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TaskPulse API online',
    env: process.env.NODE_ENV || 'development'
  });
});
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).then(()=>console.log("Mongo connected"));

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log("Backend running on "+PORT));
