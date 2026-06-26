# Deployment Status

This file tracks which portfolio projects have a stable public demo and which ones are code-first/local demos.

| Project | Status | Recommended action |
| --- | --- | --- |
| TaskPulse Frontend | Vercel-ready | Deploy as static frontend. Use demo/mock mode if backend URL is missing. |
| TaskPulse Backend | Needs backend env | Requires `MONGODB_URI`, `JWT_SECRET` and `CORS_ORIGIN`. Deploy to Render/Railway/other Node host. |
| Nutrition Analyzer | Python API/UI | Deploy to Render Free or keep as local/API demo. |
| Log Monitor | Python API/dashboard | Deploy to Render Free or keep as local dashboard demo. |
| Web Hardening Auditor | Code-first security project | Keep as security project. Add sample reports/screenshots. |
| Presupuesto Electrico | Static frontend candidate | Deploy on Vercel if build/static structure is ready. |

## Broken/free-hosting rule

If a Railway/Vercel/Render URL stops working:

1. Do not delete the project.
2. Remove or demote the broken URL.
3. Mark the project as `Code-first` or `Local demo`.
4. Add screenshots and local run instructions.
5. Re-deploy only when env vars and free-tier limits are clear.
