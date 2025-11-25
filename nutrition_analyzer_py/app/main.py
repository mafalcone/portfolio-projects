from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from .foods_db import search_foods, FOODS

app = FastAPI(title="Nutrition Analyzer (Python)")

# Archivos estáticos y templates
app.mount("/static", StaticFiles(directory="nutrition_analyzer_py/app/static"), name="static")
templates = Jinja2Templates(directory="nutrition_analyzer_py/app/templates")


@app.get("/", response_class=HTMLResponse)
async def home(request: Request, q: str = ""):
    results = search_foods(q)
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "query": q,
            "results": results,
            "total_foods": len(FOODS),
        },
    )


@app.get("/api/foods")
async def api_foods(q: str = ""):
    """Endpoint JSON para usar desde otros clientes."""
    return {
        "query": q,
        "results": search_foods(q),
        "count": len(search_foods(q)),
    }
