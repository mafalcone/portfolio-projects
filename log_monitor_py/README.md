# Log Monitor

FastAPI dashboard for log parsing and basic system visibility.

## Features

- Log parsing and visualization
- CPU and memory metrics
- Process list endpoint
- Dashboard and REST API routes
- Lightweight structure for monitoring/troubleshooting demos

## Tech stack

- Python
- FastAPI
- Uvicorn
- Jinja2
- psutil

## Run locally

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open the local dashboard in the browser after the server starts.

## Notes

This project is intended to show infrastructure, support and operational troubleshooting concepts through a compact Python/FastAPI implementation.
