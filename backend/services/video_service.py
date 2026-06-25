from datetime import datetime
from pathlib import Path
from uuid import uuid4

import cv2
from fastapi import HTTPException, UploadFile, status
from ultralytics import YOLO

from database.mongodb import get_database
from utils.config import settings

VEHICLE_CLASSES = {"car": "cars", "motorcycle": "motorcycles", "bus": "buses", "truck": "trucks"}


def original_video_path(session: dict) -> Path:
    return Path(settings.upload_dir) / session["filename"]


def processed_video_path(session: dict) -> Path | None:
    stored_name = session.get("processed_filename") or session.get("processed_video_filename")
    if stored_name:
        candidate = Path(settings.processed_dir) / Path(stored_name).name
        return candidate if candidate.exists() else None

    session_id = session["session_id"]
    candidates = [
        Path(settings.processed_dir) / f"{session_id}_processed.mp4",
        Path(settings.processed_dir) / f"processed_{session_id}.mp4",
        Path(settings.processed_dir) / session["filename"],
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


def density_level(total: int) -> str:
    if total >= 30:
        return "High"
    if total >= 12:
        return "Medium"
    return "Low"


async def save_upload(file: UploadFile, user: dict) -> dict:
    if not file.filename or not file.filename.lower().endswith(".mp4"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only .mp4 videos are supported")

    database = get_database()
    session_id = str(uuid4())
    safe_name = Path(file.filename).name
    stored_filename = f"{session_id}_{safe_name}"
    destination = Path(settings.upload_dir) / stored_filename

    with destination.open("wb") as buffer:
        while chunk := await file.read(1024 * 1024):
            buffer.write(chunk)

    session_doc = {
        "session_id": session_id,
        "user_id": str(user["_id"]),
        "filename": stored_filename,
        "original_filename": safe_name,
        "upload_time": datetime.utcnow(),
        "status": "uploaded",
        "processed_frames": 0,
    }
    await database.sessions.insert_one(session_doc)
    return session_doc


async def get_user_session(session_id: str, user: dict) -> dict:
    session = await get_database().sessions.find_one({"session_id": session_id, "user_id": str(user["_id"])})
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    return session


async def list_user_sessions(user: dict) -> list[dict]:
    cursor = get_database().sessions.find({"user_id": str(user["_id"])}).sort("upload_time", -1)
    return [session async for session in cursor]


async def process_video(session_id: str, user: dict) -> dict:
    database = get_database()
    session = await get_user_session(session_id, user)
    video_path = original_video_path(session)
    if not video_path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Uploaded video file not found")

    await database.sessions.update_one({"_id": session["_id"]}, {"$set": {"status": "processing"}})

    counts = {"cars": 0, "motorcycles": 0, "buses": 0, "trucks": 0}
    processed_frames = 0
    model = YOLO(settings.yolo_model_path)
    capture = cv2.VideoCapture(str(video_path))

    try:
        while capture.isOpened():
            success, frame = capture.read()
            if not success:
                break

            processed_frames += 1
            if processed_frames % 5 != 0:
                continue

            results = model(frame, verbose=False)
            for result in results:
                for box in result.boxes:
                    class_name = model.names[int(box.cls[0])]
                    if class_name in VEHICLE_CLASSES:
                        counts[VEHICLE_CLASSES[class_name]] += 1
    except Exception as exc:
        await database.sessions.update_one(
            {"_id": session["_id"]},
            {"$set": {"status": "failed", "processed_frames": processed_frames}},
        )
        raise HTTPException(status_code=500, detail=f"Video processing failed: {exc}") from exc
    finally:
        capture.release()

    total_vehicle = sum(counts.values())
    density = density_level(total_vehicle)
    stats_doc = {
        "session_id": session_id,
        "total_vehicle": total_vehicle,
        **counts,
        "density_level": density,
        "updated_at": datetime.utcnow(),
    }

    await database.traffic_stats.update_one({"session_id": session_id}, {"$set": stats_doc}, upsert=True)
    await database.sessions.update_one(
        {"_id": session["_id"]},
        {"$set": {"status": "completed", "processed_frames": processed_frames}},
    )
    await create_alerts(session_id, total_vehicle, density)
    return stats_doc


async def create_alerts(session_id: str, total_vehicle: int, density: str) -> None:
    database = get_database()
    alerts = []
    if total_vehicle >= settings.vehicle_count_alert_threshold:
        alerts.append(
            {
                "session_id": session_id,
                "alert_type": "Vehicle Threshold",
                "message": f"Vehicle count crossed threshold with {total_vehicle} detections.",
                "severity": "warning",
                "timestamp": datetime.utcnow(),
                "status": "open",
            }
        )
    if density == "High":
        alerts.append(
            {
                "session_id": session_id,
                "alert_type": "High Traffic Density",
                "message": "Traffic density reached High level.",
                "severity": "critical",
                "timestamp": datetime.utcnow(),
                "status": "open",
            }
        )

    if alerts:
        await database.alerts.insert_many(alerts)
