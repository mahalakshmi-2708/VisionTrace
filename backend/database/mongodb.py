from motor.motor_asyncio import AsyncIOMotorClient

from utils.config import settings


class MongoDB:
    client: AsyncIOMotorClient | None = None
    database = None


db = MongoDB()


async def connect_to_mongo() -> None:
    db.client = AsyncIOMotorClient(settings.mongodb_uri)
    db.database = db.client[settings.database_name]
    await db.database.users.create_index("email", unique=True)
    await db.database.sessions.create_index("session_id", unique=True)
    await db.database.traffic_stats.create_index("session_id")
    await db.database.alerts.create_index("session_id")


async def close_mongo_connection() -> None:
    if db.client:
        db.client.close()


def get_database():
    if db.database is None:
        raise RuntimeError("Database connection is not initialized")
    return db.database
