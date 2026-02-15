import datetime

from sqlalchemy import Column
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, Any, List, Dict
from pydantic import BaseModel
from pgvector.sqlalchemy import VECTOR
from datetime import datetime, timezone

class User(SQLModel, table=True):
    __table_args__ = {"schema": "loom"}
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True)
    password: str
    documents: List["Document"] = Relationship(back_populates="user")
    files: List["File"] = Relationship(back_populates="user")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )

class Document(SQLModel, table=True):
    __table_args__ = {"schema": "loom"}
    __tablename__ = "documents"
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str
    file_path: str
    page: int
    filename: str
    embedding: Any = Field(sa_column=Column(VECTOR(384)))
    user_id: int = Field(foreign_key="loom.users.id")
    user: Optional[User] = Relationship(back_populates="documents")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )

class File(SQLModel, table=True):
    __table_args__ = {"schema": "loom"}
    __tablename__ = "files"
    id: Optional[int] = Field(default=None, primary_key=True)
    file_path: str
    filename: str
    chunks: int
    user_id: int = Field(foreign_key="loom.users.id")
    user: Optional[User] = Relationship(back_populates="files")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )

class SignupData(BaseModel):
    name: str
    email: str
    password: str
    passwordConfirmation: str

class LoginData(BaseModel):
    email: str
    password: str
