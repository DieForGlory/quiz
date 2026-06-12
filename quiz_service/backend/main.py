from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Импорты роутеров (оставить существующие)
from api.v1 import admin, public

app = FastAPI(title="Quiz API")

# ДОБАВИТЬ ЭТОТ БЛОК
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене заменить на ["http://localhost:5173", "http://localhost:5174"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров (оставить существующие)
app.include_router(admin.router, prefix="/api/v1")
app.include_router(public.router, prefix="/api/v1")