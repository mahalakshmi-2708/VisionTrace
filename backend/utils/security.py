import hashlib
import hmac
import secrets
from datetime import datetime, timedelta

from jose import JWTError, jwt

from utils.config import settings


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    password_hash = hashlib.sha256(f"{salt}{password}".encode("utf-8")).hexdigest()
    return f"{salt}${password_hash}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt, expected_hash = stored_hash.split("$", 1)
    except ValueError:
        return False

    password_hash = hashlib.sha256(f"{salt}{password}".encode("utf-8")).hexdigest()
    return hmac.compare_digest(password_hash, expected_hash)


def create_access_token(subject: str) -> str:
    expires_at = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": subject, "exp": expires_at}
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        return payload.get("sub")
    except JWTError:
        return None
