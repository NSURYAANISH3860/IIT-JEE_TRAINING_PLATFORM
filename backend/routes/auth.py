from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from authentication.security import create_access_token, get_jwt_settings, hash_password, verify_password
from db import get_session
from models.schemas import UserSignup, UserLogin, UserPublic
from storage import create_user, get_user_by_email
from routes.dependencies import get_current_user


router = APIRouter(prefix="/api/auth", tags=["Authentication"])


def clean_email(email: str) -> str:
    return email.strip().lower()


def public_user(user: UserPublic | dict) -> dict:
    return {
        "id": user.id if hasattr(user, "id") else user["id"],
        "name": user.name if hasattr(user, "name") else user["name"],
        "email": user.email if hasattr(user, "email") else user["email"],
        "class_level": user.class_level if hasattr(user, "class_level") else user["class_level"],
        "target_exam": user.target_exam if hasattr(user, "target_exam") else user["target_exam"],
        "role": user.role if hasattr(user, "role") else user["role"],
        "is_active": user.is_active if hasattr(user, "is_active") else user["is_active"],
        "is_verified": user.is_verified if hasattr(user, "is_verified") else user["is_verified"],
        "created_at": user.created_at if hasattr(user, "created_at") else user["created_at"],
    }


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user_data: UserSignup, session: Session = Depends(get_session)):
    user = create_user(
        session,
        {
            "name": user_data.name,
            "email": clean_email(user_data.email),
            "hashed_password": hash_password(user_data.password),
            "class_level": user_data.class_level,
            "target_exam": user_data.target_exam,
            "role": "student",
        },
    )

    return {
        "message": "Signup successful",
        "user": public_user(user),
    }


@router.post("/login")
def login(login_data: UserLogin, session: Session = Depends(get_session)):
    email = clean_email(login_data.email)
    user = get_user_by_email(session, email)

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        data={
            "sub": user.email,
            "user_id": user.id,
            "role": user.role,
        }
    )
    expires_in_minutes = get_jwt_settings()["expire_minutes"]

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in_minutes": expires_in_minutes,
    }


@router.get("/me", response_model=UserPublic)
def get_current_user_route(current_user=Depends(get_current_user)):
    return public_user(current_user)
