from pathlib import Path
from collections import Counter
import re
from typing import List, Dict, Any

from fastapi import FastAPI, Request, Query
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates


BASE_DIR = Path(__file__).resolve().parent
LOGS_DIR = BASE_DIR / "logs"

app = FastAPI(
    title="Log Monitor",
    description="Proyecto de portfolio - Monitor de logs en Python + FastAPI",
)

# Static y templates
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


LOG_PATTERN = re.compile(
    r"^\[(?P<ts>.+?)\]\s+(?P<level>[A-Z]+)\s+(?P<msg>.*)$"
)


def parse_log_file(log_path: Path) -> Dict[str, Any]:
    """
    Parsea un archivo de log con líneas del estilo:
    [2025-11-27 10:00:00] INFO Mensaje...

    Devuelve métricas + últimas líneas parseadas.
    """
    if not log_path.exists():
        raise FileNotFoundError(f"No existe el archivo: {log_path}")

    with log_path.open("r", encoding="utf-8", errors="ignore") as f:
        lines = [line.rstrip("\n") for line in f]

    total_lines = len(lines)
    level_counts: Counter[str] = Counter()
    parsed_lines: List[Dict[str, str]] = []

    for line in lines:
        m = LOG_PATTERN.match(line.strip())
        if not m:
            # Línea que no matchea el patrón, la ignoramos en las métricas
            continue

        data = m.groupdict()
        level = data["level"]
        level_counts[level] += 1
        parsed_lines.append(data)

    recent = parsed_lines[-20:] if parsed_lines else []

    return {
        "total_lines": total_lines,
        "level_counts": dict(level_counts),
        "recent": recent,
    }


@app.get("/", response_class=HTMLResponse)
async def dashboard(
    request: Request,
    log: str | None = Query(
        default=None,
        description="Nombre del archivo de log dentro de la carpeta logs/",
    ),
):
    """
    Vista web principal.
    - Si no se pasa ?log= muestra sólo el formulario.
    - Si se pasa ?log=archivo.log intenta parsearlo y mostrar métricas.
    """
    stats = None
    recent = []
    error_message = None

    if log:
        log_path = LOGS_DIR / log
        try:
            result = parse_log_file(log_path)
            stats = {
                "total_lines": result["total_lines"],
                "level_counts": result["level_counts"],
            }
            recent = result["recent"]
        except FileNotFoundError:
            error_message = f"El archivo '{log}' no existe en la carpeta logs/."
        except Exception as exc:
            error_message = f"Error al procesar el archivo: {exc}"

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
async def api_logs(
    log: str = Query(..., description="Nombre del archivo de log en logs/"),
):
    """
    Endpoint JSON para el mismo análisis de logs.
    Ej: /api/logs?log=example.log
    """
    log_path = LOGS_DIR / log
    try:
        result = parse_log_file(log_path)
        return result
    except FileNotFoundError:
        return JSONResponse(
            {"error": f"El archivo '{log}' no existe en logs/."},
            status_code=404,
        )
    except Exception as exc:
        return JSONResponse(
            {"error": f"Error al procesar el archivo: {exc}"},
            status_code=500,
        )


# Para correrlo manualmente: python -m app.main
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8082,
        reload=True,
    )

# =========================
# Dashboard de sistema (CPU/RAM/procesos/log tail)
# Ruta: /dashboard
# =========================

from pathlib import Path
from fastapi import Request

@app.get("/dashboard")
async def dashboard_view(request: Request):
    """
    Dashboard web con métricas de sistema y tail de logs.
    """
    return templates.TemplateResponse(
        "dashboard.html",
        {"request": request}
    )


@app.get("/api/metrics/cpu")
async def api_cpu_metrics():
    """
    Devuelve % de uso de CPU y cantidad de núcleos.
    """
    import psutil

    return {
        "percent": psutil.cpu_percent(interval=0.2),
        "cores": psutil.cpu_count(logical=True),
    }


@app.get("/api/metrics/memory")
async def api_memory_metrics():
    """
    Devuelve uso de RAM.
    """
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
    """
    Devuelve una lista de procesos con CPU y RAM.
    Marca 'suspicious' si consumen mucho.
    """
    import psutil

    procesos = []
    for p in psutil.process_iter(
        ["pid", "name", "cpu_percent", "memory_percent"]
    ):
        try:
            info = p.info
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

        cpu = info.get("cpu_percent") or 0.0
        mem = info.get("memory_percent") or 0.0
        name = (info.get("name") or "").lower()

        sospechoso = (
            cpu >= 50
            or mem >= 10
            or any(bad in name for bad in ["miner", "crypt", "hack", "keylog"])
        )

        procesos.append(
            {
                "pid": info.get("pid"),
                "name": info.get("name"),
                "cpu_percent": round(cpu, 1),
                "memory_percent": round(mem, 1),
                "suspicious": sospechoso,
            }
        )

    # Ordeno por CPU descendente y corto en 'limit'
    procesos = sorted(
        procesos, key=lambda p: p["cpu_percent"], reverse=True
    )[:limit]

    return {"processes": procesos}


@app.get("/api/log_tail")
async def api_log_tail(filename: str, lines: int = 80):
    """
    Devuelve las últimas 'lines' líneas del log indicado.
    Usa la carpeta app/logs.
    """
    logs_dir = Path(__file__).parent / "logs"
    log_path = logs_dir / filename

    if not log_path.exists():
        return {
            "error": f"El archivo '{filename}' no existe en la carpeta logs/."
        }

    try:
        content = log_path.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        return {"error": f"No se pudo leer el archivo: {e}"}

    all_lines = content.splitlines()
    tail = all_lines[-lines:] if len(all_lines) > lines else all_lines

    return {"lines": tail}
