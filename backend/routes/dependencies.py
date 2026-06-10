from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel import Session

from authentication.security import decode_access_token
from db import get_session
from storage import get_user_by_email
from models.db_models import User

bearer_scheme = HTTPBearer()


def get_email_from_token(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> str:
    token_data = decode_access_token(credentials.credentials)
    email = token_data.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    return email


def get_current_user(
    session: Session = Depends(get_session),
    email: str = Depends(get_email_from_token),
) -> User:
    user = get_user_by_email(session, email)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )
    return user


def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )
    return user
