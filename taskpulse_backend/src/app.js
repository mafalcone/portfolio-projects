import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

dotenv.config();

// Crear app de Express
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = (process.env.CORS_ORIGIN || "")
        .split(",")
        .map(o => o.trim())
        .filter(Boolean);

      // Permitir requests sin origin (Postman, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Si no se definió CORS_ORIGIN, permitir todo (fallback seguro)
      if (allowedOrigins.length === 0) {
        return callback(null, true);
      }

      // Validar contra la whitelist
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

// Middlewares
app.use(express.json());

// Ruta raíz (health check / info básica)
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TaskPulse API online',
  });
});

// Puerto: Railway pone PORT, si no usamos 5000
const PORT = process.env.PORT || 5000;

// URI de Mongo: probamos primero MONGO_URI y luego MONGODB_URI
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('❌ ERROR: MONGO_URI / MONGODB_URI no está definido en las variables de entorno.');
  process.exit(1);
}

// Conexión a MongoDB y arranque del servidor
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 TaskPulse backend escuchando en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  });

// Rutas de la API (IMPORTANTE: prefijo /api)
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

export default app;
