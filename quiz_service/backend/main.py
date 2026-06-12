import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Импорты роутеров (оставить существующие)
from api.v1 import admin, public

app = FastAPI(title="Quiz API")

# ДОБАВИТЬ ЭТОТ БЛОК
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in os.environ.get("BACKEND_CORS_ORIGINS", "https://gh.uz,https://www.gh.uz").split(",") if o.strip()],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
def health():
    return {"status": "ok"}

# Подключение роутеров (оставить существующие)
app.include_router(admin.router, prefix="/api/v1")
app.include_router(public.router, prefix="/api/v1")