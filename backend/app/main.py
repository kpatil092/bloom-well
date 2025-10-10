from fastapi import FastAPI
from app.routes import auth
from app.utils.db import init_db

app = FastAPI(title="BloomWell Backend")

app.include_router(auth.router)

@app.on_event("startup")
async def startup_event():
    print("Server starting up... creating indexes if needed...")
    await init_db()
    print("Indexes ensured.")

@app.get("/")
async def root():
    return {"message": "BloomWell Backend is running!"}

# uvicorn app.main:app --reload
