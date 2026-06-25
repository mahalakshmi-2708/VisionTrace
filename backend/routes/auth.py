from fastapi import APIRouter, Depends

from models.schemas import TokenResponse, UserLogin, UserOut, UserRegister
from services.auth_service import login_user, register_user, serialize_user
from utils.dependencies import get_current_user

router = APIRouter()


@router.post("/register", response_model=UserOut, status_code=201)
async def register(payload: UserRegister):
    return await register_user(payload)


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin):
    return await login_user(payload)


@router.get("/me", response_model=UserOut)
async def me(current_user: dict = Depends(get_current_user)):
    return serialize_user(current_user)
