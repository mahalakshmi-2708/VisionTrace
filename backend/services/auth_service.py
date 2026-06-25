from datetime import datetime

from fastapi import HTTPException, status

from database.mongodb import get_database
from models.schemas import UserLogin, UserRegister
from utils.security import create_access_token, hash_password, verify_password


def serialize_user(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "created_at": user["created_at"],
    }


async def register_user(payload: UserRegister) -> dict:
    database = get_database()
    existing_user = await database.users.find_one({"email": payload.email.lower()})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user_doc = {
        "name": payload.name.strip(),
        "email": payload.email.lower(),
        "password_hash": hash_password(payload.password),
        "created_at": datetime.utcnow(),
    }
    result = await database.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    return serialize_user(user_doc)


async def login_user(payload: UserLogin) -> dict:
    database = get_database()
    user = await database.users.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    access_token = create_access_token(str(user["_id"]))
    return {"access_token": access_token, "token_type": "bearer", "user": serialize_user(user)}
