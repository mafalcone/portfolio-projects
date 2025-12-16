# Web Hardening Auditor

CLI + HTML tool to audit basic web security posture (portfolio project).

## What it checks
- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- HTTPS & TLS certificate metadata (best-effort)
- Cookie flags (Secure / HttpOnly / SameSite - best-effort)
- Information leakage headers (Server, X-Powered-By)
- Final security score (0–100) + recommendations

## Install

pip install -r requirements.txt

## Run

python audit.py https://example.com

## Output
- JSON report (machine-readable)
- HTML report (shareable, portfolio-friendly)

## Notes
This is a lightweight hardening auditor, not a full vulnerability scanner.
