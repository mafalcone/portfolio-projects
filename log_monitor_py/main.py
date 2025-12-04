#!/usr/bin/env python
from __future__ import annotations

import argparse
import logging
import os
import sys
import time
from collections import deque
from pathlib import Path
import shutil
from typing import Any, Dict, List

# --- Paths base del proyecto ---
BASE_DIR = Path(__file__).resolve().parent
LOGS_DIR = BASE_DIR / "app" / "logs"
LOGS_DIR.mkdir(parents=True, exist_ok=True)
LOG_FILE = LOGS_DIR / "monitor_cli.log"

# --- Logging automático a archivo + consola ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler(sys.stdout),
    ],
)

# Palabras clave muy simples para "procesos sospechosos" (demo)
SUSPICIOUS_KEYWORDS = [
    "nmap",
    "hydra",
    "sqlmap",
    "john ",
    "hashcat",
    "nc ",
    " netcat",
    "aircrack",
    "masscan",
    "msfconsole",
]


def safe_log_path(log_name: str) -> Path:
    """Devuelve la ruta segura dentro de app/logs/."""
    log_path = (LOGS_DIR / log_name).resolve()
    if not str(log_path).startswith(str(LOGS_DIR.resolve())):
        raise ValueError("Solo se permiten logs dentro de app/logs/")
    return log_path


def tail_log(log_name: str, lines: int = 20) -> List[str]:
    """Devuelve las últimas N líneas de un log."""
    path = safe_log_path(log_name)
    if not path.exists():
        raise FileNotFoundError(f"El archivo {path.name} no existe en app/logs/")

    dq: deque[str] = deque(maxlen=lines)
    with path.open("r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            dq.append(line.rstrip("\n"))
    return list(dq)


def watch_log(log_name: str) -> None:
    """Tail -f sencillo: muestra nuevas líneas en tiempo real."""
    path = safe_log_path(log_name)
    if not path.exists():
        raise FileNotFoundError(f"El archivo {path.name} no existe en app/logs/")

    logging.info("Monitoreando %s (Ctrl+C para salir)", path.name)

    with path.open("r", encoding="utf-8", errors="ignore") as f:
        # Ir al final del archivo
        f.seek(0, os.SEEK_END)
        while True:
            line = f.readline()
            if line:
                print(line.rstrip("\n"))
            else:
                time.sleep(1)


def get_system_metrics() -> Dict[str, Any]:
    """Devuelve métricas básicas de CPU/RAM/disco usando solo stdlib."""
    # Carga promedio
    load1 = load5 = load15 = None
    try:
        load1, load5, load15 = os.getloadavg()
    except (AttributeError, OSError):
        pass

    # Memoria
    mem_used_pct = None
    mem_total = mem_available = None
    try:
        with open("/proc/meminfo", "r", encoding="utf-8") as f:
            for line in f:
                if line.startswith("MemTotal:"):
                    mem_total = int(line.split()[1])
                elif line.startswith("MemAvailable:"):
                    mem_available = int(line.split()[1])
        if mem_total and mem_available is not None:
            mem_used_pct = (mem_total - mem_available) / mem_total * 100.0
    except FileNotFoundError:
        pass

    # Disco
    disk_used_pct = None
    try:
        usage = shutil.disk_usage("/")
        disk_used_pct = usage.used / usage.total * 100.0
    except Exception:
        pass

    return {
        "load1": load1,
        "load5": load5,
        "load15": load15,
        "mem_used_pct": mem_used_pct,
        "disk_used_pct": disk_used_pct,
    }


def scan_processes() -> List[Dict[str, Any]]:
    """Busca procesos cuyo comando contenga alguna keyword de la lista."""
    results: List[Dict[str, Any]] = []
    proc_root = Path("/proc")
    if not proc_root.exists():
        return results

    for entry in proc_root.iterdir():
        if not entry.is_dir() or not entry.name.isdigit():
            continue
        pid = int(entry.name)
        cmd = ""
        try:
            cmdline_path = entry / "cmdline"
            if cmdline_path.exists():
                cmdline = cmdline_path.read_text(encoding="utf-8", errors="ignore")
                cmd = cmdline.replace("\x00", " ").strip()
            else:
                comm_path = entry / "comm"
                if comm_path.exists():
                    cmd = comm_path.read_text(encoding="utf-8", errors="ignore").strip()
        except Exception:
            continue

        low = cmd.lower()
        for kw in SUSPICIOUS_KEYWORDS:
            if kw in low:
                results.append({"pid": pid, "cmd": cmd, "keyword": kw})
                break
    return results


# ======================
#   COMANDOS DEL CLI
# ======================

def cmd_metrics(args: argparse.Namespace) -> None:
    m = get_system_metrics()
    print("=== Métricas de sistema ===")
    if m["load1"] is not None:
        print(f"Carga promedio (1m,5m,15m): {m['load1']:.2f}, {m['load5']:.2f}, {m['load15']:.2f}")
    else:
        print("Carga promedio: no disponible en esta plataforma.")

    if m["mem_used_pct"] is not None:
        print(f"Memoria usada: {m['mem_used_pct']:.1f}%")
    else:
        print("Memoria: no disponible.")

    if m["disk_used_pct"] is not None:
        print(f"Disco / usado: {m['disk_used_pct']:.1f}%")
    else:
        print("Disco: no disponible.")

    logging.info("Comando metrics ejecutado")


def cmd_processes(args: argparse.Namespace) -> None:
    procs = scan_processes()
    print("=== Procesos potencialmente sospechosos ===")
    if not procs:
        print("No se encontraron procesos sospechosos según la lista de keywords.")
    else:
        for p in procs:
            print(f"[PID {p['pid']}] {p['cmd']}  (match: {p['keyword']})")
    logging.info("Comando processes ejecutado (%d hallados)", len(procs))


def cmd_tail(args: argparse.Namespace) -> None:
    lines = tail_log(args.log, args.lines)
    print(f"=== Últimas {len(lines)} líneas de {args.log} ===")
    for line in lines:
        print(line)
    logging.info("Comando tail ejecutado sobre %s", args.log)


def cmd_watch(args: argparse.Namespace) -> None:
    try:
        watch_log(args.log)
    except KeyboardInterrupt:
        print("\n[Saliendo del watch]")
    logging.info("Comando watch ejecutado sobre %s", args.log)


def cmd_web(args: argparse.Namespace) -> None:
    import uvicorn  # ya lo tenés instalado por el proyecto web

    logging.info("Levantando interfaz web en puerto %d", args.port)
    uvicorn.run("app.main:app", host="0.0.0.0", port=args.port, reload=False)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Log Monitor - Proyecto de portfolio (CLI + FastAPI)",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # log monitor CLI
    p_tail = sub.add_parser("tail", help="Ver las últimas líneas de un log")
    p_tail.add_argument("log", help="Nombre de archivo dentro de app/logs/")
    p_tail.add_argument(
        "-n", "--lines", type=int, default=20, help="Cantidad de líneas (default 20)"
    )
    p_tail.set_defaults(func=cmd_tail)

    p_watch = sub.add_parser("watch", help="Seguir un log en tiempo real (tail -f)")
    p_watch.add_argument("log", help="Nombre de archivo dentro de app/logs/")
    p_watch.set_defaults(func=cmd_watch)

    # métricas de sistema
    p_metrics = sub.add_parser("metrics", help="Ver uso de CPU/RAM y disco")
    p_metrics.set_defaults(func=cmd_metrics)

    # procesos sospechosos
    p_procs = sub.add_parser("processes", help="Buscar procesos sospechosos en /proc")
    p_procs.set_defaults(func=cmd_processes)

    # levantar la web
    p_web = sub.add_parser("web", help="Levantar interfaz web (FastAPI)")
    p_web.add_argument("--port", type=int, default=8082, help="Puerto HTTP (default 8082)")
    p_web.set_defaults(func=cmd_web)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
