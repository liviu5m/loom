from fastapi import APIRouter
from fastapi.params import Depends
from sqlmodel import Session, select
from app.models import File, User
from sqlalchemy import delete
from app.routes.auth import get_current_user
from app.database import engine
from fastapi_pagination import Page, Params
from fastapi_pagination.ext.sqlmodel import paginate

router = APIRouter()

@router.get("/",response_model=Page[File])
def search_files(search: str,params: Params = Depends(), user: User = Depends(get_current_user)):
    with Session(engine) as session:
        statement = select(File).where(File.filename.ilike(f"%{search}%"), File.user_id == user.id)
        return paginate(session, statement, params)

@router.delete("/{file_id}")
def search_files(file_id: int):
    with Session(engine) as session:
        stmt = delete(File).where(File.id == file_id)
        result = session.execute(stmt)
        session.commit()
        return "File deleted"


def save_file(file_path, filename, chunks, user_id):
    with Session(engine) as session:
        file = File(file_path=file_path, filename=filename, chunks=chunks, user_id=user_id)
        session.add(file)
        session.commit()
    return "File saved"

def delete_file(file_path):
    with Session(engine) as session:
        stmt = delete(File).where(File.file_path == file_path)
        result = session.execute(stmt)
        session.commit()
    return "File saved"

