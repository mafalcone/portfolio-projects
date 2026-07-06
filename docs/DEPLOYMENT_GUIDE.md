# Deployment Guide

## Vercel

Use Vercel for static frontends and React/Vite apps.

Recommended Vercel project settings for `taskpulse_frontend`:

- Framework preset: Vite
- Root directory: `taskpulse_frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`

Environment variable:

- `VITE_API_BASE_URL`: optional live backend URL.

If `VITE_API_BASE_URL` is empty, the frontend should run in demo/mock mode so the public demo does not look broken.

---

## Render Free / Python APIs

Recommended for:

- `nutrition_analyzer_py`
- `log_monitor_py`

Build command:

- `pip install -r requirements.txt`

Start command:

- `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

---

## TaskPulse backend

Required environment variables:

- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `NODE_ENV`

Start command:

- `npm start`

---

## Portfolio rule

Every project must have at least one reliable review path:

- live URL, or
- screenshots, or
- local run instructions, or
- demo/mock mode.
