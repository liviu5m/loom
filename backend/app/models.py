from sqlmodel import SQLModel, Field
from typing import Optional
from pydantic import BaseModel

class User(SQLModel, table=True):
    __table_args__ = {"schema": "loom"}
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True)
    password: str

class SignupData(BaseModel):
    name: str
    email: str
    password: str
    passwordConfirmation: str

class LoginData(BaseModel):
    email: str
    password: str
