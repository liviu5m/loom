from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.routes.auth import get_current_user
from app.models import User
from app.database import supabase

router = APIRouter()

@router.post("/upload")
async def upload_user_file(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user)
):
    try:
        file_content = await file.read()

        file_path = f"{user.id}/{file.filename}"

        response = supabase.storage.from_("user_docs").upload(
            path=file_path,
            file=file_content,
            file_options={"content-type": file.content_type}
        )

        return {"status": "success", "path": file_path}
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail="Upload failed")