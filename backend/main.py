from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from oauthlib.uri_validate import query

from app.database import create_db_and_tables
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, storage, document, file, response

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

app.include_router(
    document.router,
    prefix="/document",
    tags=["Document"]
)

app.include_router(
    file.router,
    prefix="/file",
    tags=["File"]
)


app.include_router(
    response.router,
    prefix="/response",
    tags=["Response"]
)


