from pydantic import BaseModel, EmailStr, Field


class UserSignup(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=6)
    class_level: str = Field(..., min_length=2)
    target_exam: str = Field(..., min_length=2)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
