import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine, Session, Field
from app.models import User
from supabase import create_client, Client
import app.models

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    echo=True,
)

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

if not url or not key:
    raise ValueError("Supabase URL and Key must be set in environment variables")

supabase: Client = create_client(url, key)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_user_by_id(user_id: int):
    with Session(engine) as session:
        return session.get(User, user_id)