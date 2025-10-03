from fastapi import FastAPI
from .utils.db import init_db
from .config import settings

app = FastAPI(title="Health & Wellness Tracker (Backend)")

@app.on_event("startup")
async def on_startup():
    # initialize Mongo + Beanie
    await init_db()

@app.get("/health")
async def health():
    return {"status": "ok", "db": settings.MONGODB_DB}
