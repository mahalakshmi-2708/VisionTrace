from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Query, Request, UploadFile, status
from fastapi.responses import FileResponse
from bson import ObjectId

from database.mongodb import get_database
from services.video_service import (
    get_user_session,
    list_user_sessions,
    original_video_path,
    process_video,
    processed_video_path,
    save_upload,
)
from utils.dependencies import get_current_user
from utils.security import decode_access_token

router = APIRouter()


def serialize_session(session: dict) -> dict:
    original_available = original_video_path(session).exists()
    processed_available = processed_video_path(session) is not None
    return {
        "session_id": session["session_id"],
        "user_id": session["user_id"],
        "filename": session["filename"],
        "original_filename": session.get("original_filename", session["filename"]),
        "upload_time": session["upload_time"],
        "status": session["status"],
        "processed_frames": session.get("processed_frames", 0),
        "original_video_available": original_available,
        "processed_video_available": processed_available,
        "original_video_url": f"/video/original/{session['session_id']}" if original_available else None,
        "processed_video_url": f"/video/processed/{session['session_id']}" if processed_available else None,
    }


def safe_video_response(path: Path) -> FileResponse:
    if not path.exists() or not path.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video file not found")
    return FileResponse(path=str(path), media_type="video/mp4")


async def get_video_user(request: Request, access_token: str | None = Query(default=None)) -> dict:
    token = access_token
    authorization = request.headers.get("Authorization")
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1]

    user_id = decode_access_token(token or "")
    if not user_id or not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token")

    user = await get_database().users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    user["id"] = str(user["_id"])
    return user


@router.post("/upload", status_code=201)
async def upload_video(file: UploadFile, current_user: dict = Depends(get_current_user)):
    session = await save_upload(file, current_user)
    return serialize_session(session)


@router.post("/start-processing/{session_id}")
async def start_processing(session_id: str, current_user: dict = Depends(get_current_user)):
    return await process_video(session_id, current_user)


@router.get("/session/{session_id}")
async def get_session(session_id: str, current_user: dict = Depends(get_current_user)):
    session = await get_user_session(session_id, current_user)
    return serialize_session(session)


@router.get("/sessions")
async def get_sessions(current_user: dict = Depends(get_current_user)):
    sessions = await list_user_sessions(current_user)
    return [serialize_session(session) for session in sessions]


@router.get("/original/{session_id}")
async def get_original_video(session_id: str, current_user: dict = Depends(get_video_user)):
    session = await get_user_session(session_id, current_user)
    return safe_video_response(original_video_path(session))


@router.get("/processed/{session_id}")
async def get_processed_video(session_id: str, current_user: dict = Depends(get_video_user)):
    session = await get_user_session(session_id, current_user)
    path = processed_video_path(session)
    if not path:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Processed video is not available")
    return safe_video_response(path)
