# Portfolio Projects – Manuel Falcone

Curated technical portfolio focused on real-world IT, backend, frontend, automation, infrastructure and security work.

This repository is organized for technical review, interviews and freelance/client validation. Each project should be easy to inspect, run locally and understand even when a free hosting provider is sleeping, expired or offline.

---

## Project Index

| Project | Area | Status | Why it matters |
| --- | --- | --- | --- |
| TaskPulse | Fullstack / MERN | Vercel frontend + optional backend | Shows React, routing, auth flow, API integration and CRUD logic. |
| Log Monitor | Infrastructure / DevOps | Python API/dashboard | Strong fit for support, systems, monitoring and troubleshooting roles. |
| Web Hardening Auditor | Cybersecurity / DevSecOps | Code-first security tool | Shows security headers, HTTPS/TLS, cookie flags and audit scoring concepts. |
| Nutrition Analyzer | Python / FastAPI | Lightweight API/UI | Shows Python API design, templates and data lookup. |
| Presupuesto Electrico | Frontend / real-world tooling | Static frontend candidate | Useful as a practical budgeting/operations tool tied to real service work. |

---

## Recommended Project Categories

### Infrastructure / Support / DevOps
- `log_monitor_py`
- `smart_todos_api`
- TaskPulse backend health/API structure

### Cybersecurity / DevSecOps
- `web_hardening_auditor`
- `security_scanner`

### Fullstack
- `taskpulse_frontend`
- `taskpulse_backend`
- `presupuesto_electrico`

### Python / Automation
- `nutrition_analyzer_py`
- `ai_summarizer`

---

## Deployment Strategy

Free hosting platforms can sleep, expire or require billing. The portfolio should not depend only on a live backend.

Rules:

1. Keep code-first projects even if the live demo is offline.
2. Use screenshots and local run instructions as fallback.
3. Mark every project as one of: `Live`, `Demo mode`, `Code-first`, or `Needs backend env`.
4. Do not keep broken Railway links as the main call-to-action.
5. Prefer Vercel for static/frontends.
6. Prefer Render Free or another lightweight Python host for simple FastAPI apps.
7. For TaskPulse, keep the frontend deployable even without backend by using demo/mock mode.

---

## Current Deployment Notes

The old Railway and Vercel URLs should be treated as historical references, not as guaranteed live demos. If a live deployment is unavailable, reviewers should use the code, local instructions and screenshots/demo mode.

Recommended stable setup:

- TaskPulse frontend: Vercel, root `taskpulse_frontend`.
- TaskPulse backend: Render/Railway/Node host with MongoDB env vars.
- Nutrition Analyzer: Render Free or local FastAPI demo.
- Log Monitor: Render Free or local FastAPI dashboard.
- Security tools: code-first with sample output reports.

---

## Author

**Manuel Falcone**  
IT Consultant – Backend – Frontend – Infrastructure – Security – Automation
