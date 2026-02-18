from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session
from app.database import engine
from app.models import Response, User
from app.routes.auth import get_current_user

router = APIRouter()

class ResponseData(BaseModel):
    question: str
    response: str


@router.post("/")
def create_response(data: ResponseData, user: User = Depends(get_current_user)):
    with Session(engine) as session:
        response = Response(question=data.question, response=data.response, user_id=user.id)
        session.add(response)
        session.commit()
        session.refresh(response)
        return "Response created successfully"