from sqlalchemy import delete
from sqlmodel import Session
from app.database import engine
from app.models import User, Document
from fastapi import APIRouter, Depends
from app.routes.auth import get_current_user

router = APIRouter()

@router.get("/search")
def search_user_documents_func(
    query: str,
    user: User = Depends(get_current_user)
):
    from app.rag import search_user_documents, ask_rag_question
    result = search_user_documents(user.id, query)
    content_list = [
        {
            "content": res.content,
            "page": res.page,
            "filename": res.filename,
            "file_path": res.file_path
        }
        for res in result
    ]
    return ask_rag_question(content_list, query)

def save_documents(
    docs: list[Document]
):
    with Session(engine) as session:
        session.add_all(docs)
        session.commit()
    print("Documents saved")

def remove_user_documents(
    file_path: str
):
    with Session(engine) as session:
        stmt = delete(Document).where(Document.file_path == file_path)
        result = session.execute(stmt)
        session.commit()
    print("Document removed")
