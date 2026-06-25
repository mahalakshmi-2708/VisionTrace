from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[1]
PROJECT_DIR = BASE_DIR.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=PROJECT_DIR / ".env", env_file_encoding="utf-8")

    mongodb_uri: str = "mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority"
    database_name: str = "visiontrace"
    jwt_secret_key: str = "change-this-secret-key"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    cors_origins_raw: str = "http://localhost:5173,http://127.0.0.1:5173"
    yolo_model_path: str = "yolov8n.pt"
    vehicle_count_alert_threshold: int = 30
    upload_dir: str = str(PROJECT_DIR / "uploads")
    processed_dir: str = str(PROJECT_DIR / "processed_videos")

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins_raw.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
    Path(settings.processed_dir).mkdir(parents=True, exist_ok=True)
    return settings


settings = get_settings()
