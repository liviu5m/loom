from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from sqlmodel import Session, select
from app.models import User, SignupData
from app.database import create_db_and_tables
from argon2 import PasswordHasher
from sqlmodel import SQLModel
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine

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

passwordHasher = PasswordHasher()
@app.get("/")
def read_root():
    with Session(engine) as session:
        db_user = session.get(User, 1)
        print(db_user)
        return {"Hello": "World"}

@app.post("/auth/signup")
def read_root(data: SignupData):
    with Session(engine) as session:
        email_user = session.exec(select(User).where(User.email == data.email)).first()
        print(email_user)
        if(email_user):
            raise HTTPException(status_code=400, detail="Email already exists")
        if(data.password != data.passwordConfirmation):
            raise HTTPException(status_code=400, detail="Passwords do not match")
        new_user=User(name=data.name, email=data.email, password=passwordHasher.hash(data.password))
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return {"message": "User created successfully"}




