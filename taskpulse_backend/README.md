# TaskPulse Backend (Node + Express + MongoDB)

Backend API for TaskPulse.

## Features
- Auth (JWT)
- Tasks CRUD
- MongoDB Atlas
- CORS configured for Vercel

## Env Vars (Railway)
- `NODE_ENV`=production
- `MONGO_URI`=mongodb+srv://...
- `JWT_ACCESS_SECRET`=...
- `JWT_REFRESH_SECRET`=...
- `CORS_ORIGIN`=https://your-vercel-domain.vercel.app,https://*.vercel.app

## Health check
GET /
