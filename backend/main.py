from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException

from app.database import create_db_and_tables
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, storage

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing Database...")
    create_db_and_tables()
    yield
    print("Shutting down...")

app = FastAPI(lifespan=lifespan)
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    storage.router,
    prefix="/storage",
    tags=["Storage"]
)


