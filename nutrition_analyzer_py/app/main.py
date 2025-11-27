from pathlib import Path
from fastapi import FastAPI, Request, Query
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from .foods_db import FOODS_DB

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(
    title="Nutrition Analyzer",
    description="API + mini UI para analizar info nutricional (Python + FastAPI)",
)

templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")


@app.get("/", response_class=HTMLResponse)
async def home(request: Request, q: str | None = Query(None)):
    results = []
    if q:
        q_lower = q.lower()
        results = [
            food
            for food in FOODS_DB
            if q_lower in food["name"].lower()
            or q_lower in food.get("category", "").lower()
        ]
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "query": q or "",
            "results": results,
        },
    )


@app.get("/api/foods")
async def search_foods(q: str = Query(..., description="Nombre del alimento a buscar")):
    q_lower = q.lower()
    return [
        food
        for food in FOODS_DB
        if q_lower in food["name"].lower()
        or q_lower in food.get("category", "").lower()
    ]
