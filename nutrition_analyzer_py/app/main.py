from pathlib import Path

from fastapi import FastAPI, Query, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from .foods_db import FOODS_DB

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(
    title="Nutrition Analyzer",
    description="API + pequeña UI para consultar información nutricional de alimentos.",
)

# Archivos estáticos y templates relativos a esta carpeta
app.mount(
    "/static",
    StaticFiles(directory=str(BASE_DIR / "static"), html=False),
    name="static",
)
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "title": "Nutrition Analyzer",
        },
    )


@app.get("/api/foods")
async def search_foods(q: str = Query(..., description="Nombre del alimento a buscar")):
    q_lower = q.lower()
    results = [
        food
        for food in FOODS_DB
        if q_lower in food["name"].lower()
        or q_lower in food.get("category", "").lower()
    ]
    return {"query": q, "results": results}
