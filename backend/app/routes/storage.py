from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.routes.auth import get_current_user
from app.models import User
from app.database import supabase
import uuid
import os

router = APIRouter()
from typing import List

@router.post("/upload")
async def upload_user_file(
    files: list[UploadFile] = File(...),
    user: User = Depends(get_current_user)
):
    try:
        results = []

        for file in files:
            file_content = await file.read()
            random_id = str(uuid.uuid4())
            _, ext = os.path.splitext(file.filename)
            unique_filename = f"{random_id}{ext}"
            file_path = f"{user.id}/{unique_filename}"

            supabase.storage.from_("user_docs").upload(
                path=file_path,
                file=file_content,
                file_options={"content-type": file.content_type}
            )
            results.append({"filename": file.filename, "path": file_path})

        return {"status": "success", "filepath": file_path}

    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/remove/{file_path:path}")
async def remove_user_file(
    file_path: str,
):
    try:
        response = supabase.storage.from_("user_docs").remove([file_path])

        if not response:
            raise HTTPException(status_code=404, detail="File not found or already deleted")

        return {"status": "success", "message": f"Deleted {file_path}"}

    except Exception as e:
        print(f"Delete error: {e}")
        raise HTTPException(status_code=500, detail=str(e))