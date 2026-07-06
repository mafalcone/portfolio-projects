# Portfolio Projects - Manuel Falcone

Technical portfolio focused on IT infrastructure, support operations, backend/frontend development, automation and security tooling.

## Public portfolio

The public landing page is deployed on Vercel under the `portfolio-projects-self` domain.

## Featured projects

| Project | Area | Access | Summary |
| --- | --- | --- | --- |
| TaskPulse | Fullstack / MERN | Public browser demo | Task management app with demo auth flow, dashboard and CRUD behavior using browser-local data. |
| Incident Log Triage | Infrastructure / Blue Team | Interactive browser demo | Log parser that classifies events by type, severity and suggested next action. |
| Web Hardening Review | DevSecOps / Security | Live API demo | Passive server-side review of response status, timing and security-related headers with copyable JSON report. |
| Python Code Review Lab | Static Review / Secure Code Review | Browser demo + source folder | Static Python review demo that checks text patterns, explains notable indicators and exports JSON reports without running pasted code. |
| Nutrition Analyzer | Python / API | Interactive browser demo | Food lookup demo with visible sample dataset and nutrition values. |
| Service Estimate Calculator | Frontend | Public browser demo | Editable calculator for materials, labor, subtotals and PDF export. |

## Repository structure

- `presupuesto_electrico/` - public portfolio landing, service estimate demo and site-check API endpoint.
- `taskpulse_frontend/` - React/Vite frontend for TaskPulse public demo.
- `taskpulse_backend/` - Node/Express API source for TaskPulse.
- `log_monitor_py/` - Python/FastAPI log and system metrics dashboard source behind the Incident Log Triage demo.
- `web_hardening_auditor/` - passive site review CLI and report generator source behind the Web Hardening Review concept.
- `python_code_review_lab/` - standalone static Python code review lab with rules, samples and JSON report output.
- `nutrition_analyzer_py/` - Python/FastAPI nutritional lookup app source.

## Review notes

Public demos prioritize browser-testable functionality. Some demos intentionally use browser-local data for safe public testing. Source-only projects remain as code review material until they have production-quality public demos.

## Author

**Manuel Falcone**  
IT Consultant - Infrastructure - Support - Backend - Frontend - Security - Automation
