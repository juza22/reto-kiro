from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.base import get_db
from app.schemas.user import UserCreate, UserLogin, Token
from app.services.auth_service import register_user, login_user

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post("/register", response_model=Token, summary="Registrar nuevo usuario")
def register(data: UserCreate, db: Session = Depends(get_db)):
    user = register_user(db, data)
    result = login_user(db, data.email, data.password)
    return result


@router.post("/login", response_model=Token, summary="Iniciar sesión")
def login(data: UserLogin, db: Session = Depends(get_db)):
    return login_user(db, data.email, data.password)
