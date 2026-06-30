# Portfolio Projects – Manuel Falcone

Technical portfolio focused on IT infrastructure, support operations, backend/frontend development, automation and security tooling.

## Public portfolio

The public landing page is deployed on Vercel under the `portfolio-projects-self` domain.

## Featured projects

| Project | Area | Access | Summary |
| --- | --- | --- | --- |
| TaskPulse | Fullstack / MERN | Public browser demo | Task management app with demo auth flow, dashboard and CRUD behavior using browser-local data. |
| Incident Log Triage | Infrastructure / Blue Team | Interactive browser demo | Log parser that classifies events by type, severity and suggested next action. |
| Web Hardening Review | DevSecOps / Security | Live API demo | Passive server-side review of response status, timing and security-related headers with copyable JSON report. |
| Nutrition Analyzer | Python / API | Interactive browser demo | Food lookup demo with visible sample dataset and nutrition values. |
| Service Estimate Calculator | Frontend | Public browser demo | Editable calculator for materials, labor, subtotals and PDF export. |

## Repository structure

- `presupuesto_electrico/` – public portfolio landing, service estimate demo and site-check API endpoint.
- `taskpulse_frontend/` – React/Vite frontend for TaskPulse public demo.
- `taskpulse_backend/` – Node/Express API source for TaskPulse.
- `log_monitor_py/` – Python/FastAPI log and system metrics dashboard source behind the Incident Log Triage demo.
- `web_hardening_auditor/` – passive site review CLI and report generator source behind the Web Hardening Review concept.
- `nutrition_analyzer_py/` – Python/FastAPI nutritional lookup app source.

## Review notes

The public landing prioritizes projects that can be opened and tested in the browser. Source-only projects remain in the repository as code review material until they have production-quality public demos.

## Author

**Manuel Falcone**  
IT Consultant – Infrastructure – Support – Backend – Frontend – Security – Automation
