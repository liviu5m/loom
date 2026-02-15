from fastapi import APIRouter
from fastapi.params import Depends
from sqlmodel import Session, select
from app.models import File, User
from sqlalchemy import delete
from app.routes.auth import get_current_user
from app.database import engine

router = APIRouter()

@router.get("/")
def search_files(search: str, user: User = Depends(get_current_user)):
    with Session(engine) as session:
        statement = select(File).where(File.filename.ilike(f"%{search}%"), File.user_id == user.id)
        result = session.execute(statement)
        results = session.exec(statement).all()
        return results


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