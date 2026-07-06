from pathlib import Path

from fastapi import FastAPI, Request, Query
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app import FOODS_DB  # reexportado desde app.__init__

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(
    title="Nutrition Analyzer (Python + FastAPI)",
    description="API + UI mínima para demostrar backend en Python con buenas prácticas.",
)

# Paths relativos robustos para Railway
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))
app.mount(
    "/static",
    StaticFiles(directory=str(BASE_DIR / "static"), html=False),
    name="static",
)


def search_foods_db(query: str):
    q_lower = query.lower()
    return [
        food
        for food in FOODS_DB
        if q_lower in food["name"].lower()
        or q_lower in food.get("category", "").lower()
    ]


@app.get("/", response_class=HTMLResponse)
async def home(request: Request, q: str = ""):
    results = search_foods_db(q) if q else []
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "q": q,
            "results": results,
        },
    )


@app.get("/api/foods")
async def api_foods(
    q: str = Query(..., description="Nombre del alimento a buscar"),
):
    return {
        "query": q,
        "results": search_foods_db(q),
    }
