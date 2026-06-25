from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    created_at: datetime


class SessionOut(BaseModel):
    session_id: str
    user_id: str
    filename: str
    upload_time: datetime
    status: Literal["uploaded", "processing", "completed", "failed"]
    processed_frames: int = 0


class TrafficStatsOut(BaseModel):
    session_id: str
    total_vehicle: int = 0
    cars: int = 0
    motorcycles: int = 0
    buses: int = 0
    trucks: int = 0
    density_level: Literal["Low", "Medium", "High"] = "Low"


class AlertOut(BaseModel):
    session_id: str
    alert_type: str
    message: str
    severity: Literal["info", "warning", "critical"]
    timestamp: datetime
    status: Literal["open", "resolved"] = "open"
