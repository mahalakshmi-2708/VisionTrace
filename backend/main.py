from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database.mongodb import close_mongo_connection, connect_to_mongo
from routes import analytics, auth, video
from utils.config import settings

app = FastAPI(
    title="VisionTrace API",
    description="AI Powered Smart Traffic Monitoring System using FastAPI, MongoDB, OpenCV, and YOLOv8.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(video.router, prefix="/api/video", tags=["Video"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")
app.mount("/processed-videos", StaticFiles(directory=settings.processed_dir), name="processed-videos")


@app.on_event("startup")
async def startup() -> None:
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown() -> None:
    await close_mongo_connection()


@app.get("/")
async def root() -> dict:
    return {"message": "VisionTrace API is running", "docs": "/docs"}
