from datetime import datetime
from typing import Any, List, Optional

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


class UserPublic(BaseModel):
    id: str
    name: str
    email: EmailStr
    class_level: str
    target_exam: str
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime


class StudentSelection(BaseModel):
    subject: str = Field(..., min_length=2)
    topic: str = Field(..., min_length=2)


class QuestionCreate(BaseModel):
    exam_type: str = Field(default="jee_mains", min_length=3)
    subject: str = Field(..., min_length=2)
    topic: str = Field(..., min_length=2)
    question_text: str = Field(..., min_length=10)
    options: List[str] = Field(..., min_items=2)
    correct_option: str = Field(..., min_length=1)
    explanation: Optional[str] = None


class QuestionUpdate(BaseModel):
    exam_type: Optional[str] = None
    subject: Optional[str] = None
    topic: Optional[str] = None
    question_text: Optional[str] = None
    options: Optional[List[str]] = None
    correct_option: Optional[str] = None
    explanation: Optional[str] = None


class QuestionOut(BaseModel):
    id: str
    exam_type: str
    subject: str
    topic: str
    question_text: str
    options: List[str]


class ExamAnswer(BaseModel):
    question_id: str
    selected_option: str


class ExamSubmission(BaseModel):
    subject: str = Field(..., min_length=2)
    topic: str = Field(..., min_length=2)
    answers: List[ExamAnswer] = Field(..., min_items=1)
    duration_seconds: int = Field(..., ge=0)


class ExamResult(BaseModel):
    total_questions: int
    correct_answers: int
    score: float
    percentage: float
    details: List[Any]


class ExamAttemptOut(BaseModel):
    id: str
    subject: str
    topic: str
    total_questions: int
    correct_answers: int
    score: float
    duration_seconds: int
    created_at: datetime


class ProgressSummary(BaseModel):
    total_attempts: int
    average_score: float
    best_score: float
    recent_attempts: List[ExamAttemptOut]
    subject_accuracy: dict[str, float]
    weak_topics: dict[str, float]
