# Web Hardening Auditor

Security auditing tool designed for portfolio purposes.

This project performs a **passive web hardening audit** of a public website and generates:
- **CLI output**
- a visual **HTML report**
- a **JSON report** (machine-readable)

---

## What it checks

- Common **HTTP security headers** (CSP, HSTS, X-Frame-Options, etc.)
- HTTPS usage + TLS certificate metadata (best-effort)
- HTTP → HTTPS redirection (best-effort)
- Cookie security flags (Secure / HttpOnly / SameSite - best-effort)
- Information leakage headers (Server, X-Powered-By)
- Final **security score (0–100)** with recommendations

---

## Features

- CLI usage
- JSON + HTML report generation
- Clean dark HTML report
- Safe for portfolio demos (no intrusive scanning)

---

## Tech Stack

- Python 3
- requests
- ssl / socket
- argparse
- HTML + CSS (report rendering)

---

## Install

```bash
pip install -r requirements.txt


---

Run an audit

python audit.py https://example.com


---

Output

Reports are saved under:

reports/report_YYYYMMDD_HHMMSS.json

reports/report_YYYYMMDD_HHMMSS.html


Open the .html file in a browser to view the visual report.


---

Notes

Results may vary depending on CDNs/WAFs and server configuration.

This is intended for educational + portfolio demonstration.



---

Author

Manuel Falcone
Portfolio project – Security / Infra
