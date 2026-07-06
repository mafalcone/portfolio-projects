from pathlib import Path
from collections import Counter
from typing import List, Dict, Any
import re

from fastapi import FastAPI, Request, Query
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates


BASE_DIR = Path(__file__).resolve().parent
LOGS_DIR = BASE_DIR / "logs"

app = FastAPI(
    title="Log Monitor",
    description="Portfolio project - Python/FastAPI log monitor",
)

app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

LOG_PATTERN = re.compile(
    r"^\[(?P<ts>.+?)\]\s+(?P<level>[A-Z]+)\s+(?P<msg>.*)$"
)


def safe_log_path(filename: str) -> Path:
    name = Path(str(filename or "")).name
    if not name or name != filename or ".." in name or "/" in name or "\\" in name:
        raise FileNotFoundError("Invalid log filename")

    path = (LOGS_DIR / name).resolve()
    if LOGS_DIR.resolve() not in path.parents and path != LOGS_DIR.resolve():
        raise FileNotFoundError("Invalid log filename")

    return path


def parse_log_file(log_path: Path) -> Dict[str, Any]:
    if not log_path.exists() or not log_path.is_file():
        raise FileNotFoundError("Log file not found")

    with log_path.open("r", encoding="utf-8", errors="ignore") as file:
        lines = [line.rstrip("\n") for line in file]

    level_counts: Counter[str] = Counter()
    parsed_lines: List[Dict[str, str]] = []

    for line in lines:
        match = LOG_PATTERN.match(line.strip())
        if not match:
            continue

        data = match.groupdict()
        level_counts[data["level"]] += 1
        parsed_lines.append(data)

    return {
        "total_lines": len(lines),
        "level_counts": dict(level_counts),
        "recent": parsed_lines[-20:] if parsed_lines else [],
    }


@app.get("/", response_class=HTMLResponse)
async def dashboard(
    request: Request,
    log: str | None = Query(default=None, description="Log filename inside logs/"),
):
    stats = None
    recent = []
    error_message = None

    if log:
        try:
            result = parse_log_file(safe_log_path(log))
            stats = {
                "total_lines": result["total_lines"],
                "level_counts": result["level_counts"],
            }
            recent = result["recent"]
        except FileNotFoundError:
            error_message = f"Log file '{log}' was not found."
        except Exception:
            error_message = "The log file could not be processed."

    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "log_name": log,
            "stats": stats,
            "recent_lines": recent,
            "error_message": error_message,
        },
    )


@app.get("/api/logs", response_class=JSONResponse)
async def api_logs(log: str = Query(..., description="Log filename inside logs/")):
    try:
        return parse_log_file(safe_log_path(log))
    except FileNotFoundError:
        return JSONResponse({"error": "Log file not found"}, status_code=404)
    except Exception:
        return JSONResponse({"error": "The log file could not be processed"}, status_code=500)


@app.get("/dashboard")
async def dashboard_view(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})


@app.get("/api/metrics/cpu")
async def api_cpu_metrics():
    import psutil

    return {
        "percent": psutil.cpu_percent(interval=0.2),
        "cores": psutil.cpu_count(logical=True),
    }


@app.get("/api/metrics/memory")
async def api_memory_metrics():
    import psutil

    mem = psutil.virtual_memory()
    return {
        "percent": mem.percent,
        "total": mem.total,
        "used": mem.used,
        "available": mem.available,
    }


@app.get("/api/metrics/processes")
async def api_process_metrics(limit: int = 8):
    import psutil

    limit = max(1, min(int(limit or 8), 25))
    processes = []

    for process in psutil.process_iter(["pid", "name", "cpu_percent", "memory_percent"]):
        try:
            info = process.info
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

        cpu = info.get("cpu_percent") or 0.0
        mem = info.get("memory_percent") or 0.0
        review_flag = cpu >= 50 or mem >= 10

        processes.append(
            {
                "pid": info.get("pid"),
                "name": info.get("name"),
                "cpu_percent": round(cpu, 1),
                "memory_percent": round(mem, 1),
                "review_flag": review_flag,
            }
        )

    processes = sorted(processes, key=lambda item: item["cpu_percent"], reverse=True)[:limit]
    return {"processes": processes}


@app.get("/api/log_tail")
async def api_log_tail(filename: str, lines: int = 80):
    try:
        log_path = safe_log_path(filename)
    except FileNotFoundError:
        return {"error": "Log file not found"}

    if not log_path.exists() or not log_path.is_file():
        return {"error": "Log file not found"}

    try:
        content = log_path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return {"error": "The log file could not be read"}

    max_lines = max(1, min(int(lines or 80), 500))
    all_lines = content.splitlines()
    tail = all_lines[-max_lines:] if len(all_lines) > max_lines else all_lines

    return {"lines": tail}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8082, reload=True)
