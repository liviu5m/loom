import os

from fastapi import APIRouter, Cookie
from argon2 import PasswordHasher
from fastapi.params import Depends
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from app.models import User, SignupData, LoginData
from sqlmodel import Session, select
from fastapi import HTTPException, Response
from app.database import engine
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()
passwordHasher = PasswordHasher()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

async def get_current_user(token: str = Cookie(None)):
    with Session(engine) as session:
        if not token:
            raise HTTPException(status_code=401, detail="Not authenticated")
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: str = payload.get("user_id")
            user = session.get(User, user_id)
            if user_id is None:
                raise HTTPException(status_code=401, detail="Invalid token")
            return user
        except JWTError:
            raise HTTPException(status_code=401, detail="Could not validate credentials")

@router.post("/signup")
def signup(data: SignupData):
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


@router.post("/login")
def login(data: LoginData, response: Response):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == data.email)).first()
        if not user:
            raise HTTPException(status_code=400, detail="Account not found")
        try:
            passwordHasher.verify(user.password, data.password)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid credentials")

        expire = datetime.now(timezone.utc) + timedelta(hours=24)
        to_encode = {"user_id": str(user.id), "exp": expire}
        token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

        response.set_cookie(
            key="token",
            value=token,
            httponly=True,
            max_age=86400,
            samesite="lax",
            secure=False,
            path="/"
        )
        return {"user": user}

@router.get("/user")
def get_me(user: User = Depends(get_current_user)):
    return user

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="token",
        path="/",
        httponly=True,
        samesite="lax",
        secure=False
    )
    return {"message": "Logged out successfully"}