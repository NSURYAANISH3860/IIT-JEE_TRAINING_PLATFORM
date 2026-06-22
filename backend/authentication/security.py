import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from fastapi import HTTPException, status
from jose import JWTError, jwt
from passlib.context import CryptContext


# Load SECRET_KEY, ALGORITHM, and token expiry from .env.
load_dotenv()


# Passlib handles secure password hashing for us.
# bcrypt means plain passwords are never saved directly.
password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """Convert a plain password into a secure hash."""
    return password_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check whether a plain password matches the stored hash."""
    return password_context.verify(plain_password, hashed_password)


def get_jwt_settings():
    """Read JWT settings from environment variables."""
    secret_key = os.getenv("SECRET_KEY")
    algorithm = os.getenv("ALGORITHM", "HS256")
    expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

    if not secret_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SECRET_KEY is missing. Add it to your .env file.",
        )

    return {
        "secret_key": secret_key,
        "algorithm": algorithm,
        "expire_minutes": expire_minutes,
    }


def create_access_token(data: dict) -> str:
    """Create a JWT access token for a logged-in user."""
    settings = get_jwt_settings()
    token_data = data.copy()

    expire_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings["expire_minutes"]
    )
    token_data.update({"exp": expire_at})

    return jwt.encode(
        token_data,
        settings["secret_key"],
        algorithm=settings["algorithm"],
    )


def decode_access_token(token: str) -> dict:
    """Decode and validate a JWT token."""
    settings = get_jwt_settings()

    try:
        return jwt.decode(
            token,
            settings["secret_key"],
            algorithms=[settings["algorithm"]],
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
