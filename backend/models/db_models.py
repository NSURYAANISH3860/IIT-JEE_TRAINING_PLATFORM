from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4

from sqlalchemy import Column, JSON, String, Text
from sqlmodel import Field, SQLModel


def uuid_str() -> str:
    return str(uuid4())


class User(SQLModel, table=True):
    id: str = Field(default_factory=uuid_str, primary_key=True, index=True)
    name: str
    email: str = Field(sa_column=Column(String, unique=True, nullable=False, index=True))
    hashed_password: str
    class_level: str
    target_exam: str
    role: str = Field(default="student", nullable=False)
    is_active: bool = Field(default=True, nullable=False)
    is_verified: bool = Field(default=False, nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
    selected_subject: Optional[str] = None
    selected_topic: Optional[str] = None


class Question(SQLModel, table=True):
    id: str = Field(default_factory=uuid_str, primary_key=True, index=True)
    exam_type: str = Field(default="jee_mains", nullable=False)
    subject: str = Field(nullable=False)
    topic: str = Field(nullable=False)
    question_text: str = Field(sa_column=Column(Text, nullable=False))
    options: list[str] = Field(sa_column=Column(JSON), default_factory=list)
    correct_option: str = Field(nullable=False)
    explanation: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)


class ExamAttempt(SQLModel, table=True):
    id: str = Field(default_factory=uuid_str, primary_key=True, index=True)
    user_id: str = Field(foreign_key="user.id", nullable=False, index=True)
    subject: str = Field(nullable=False)
    topic: str = Field(nullable=False)
    total_questions: int = Field(default=0, nullable=False)
    correct_answers: int = Field(default=0, nullable=False)
    score: float = Field(default=0.0, nullable=False)
    duration_seconds: int = Field(default=0, nullable=False)
    details: list[dict] = Field(sa_column=Column(JSON), default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)


class Doubt(SQLModel, table=True):
    id: str = Field(default_factory=uuid_str, primary_key=True, index=True)
    user_id: str = Field(foreign_key="user.id", nullable=False, index=True)
    subject: str = Field(nullable=False)
    topic: str = Field(nullable=False)
    question: str = Field(sa_column=Column(Text, nullable=False))
    ai_answer: Optional[str] = Field(default=None, sa_column=Column(Text))
    status: str = Field(default="open", nullable=False, index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
