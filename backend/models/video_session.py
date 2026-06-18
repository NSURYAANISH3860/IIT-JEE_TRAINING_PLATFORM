from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid

class VideoSession(SQLModel, table=True):
    """Model for managing video lesson sessions"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    title: str
    subject: str
    topic: str
    video_url: str
    duration_minutes: int
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    instructor_name: Optional[str] = None
    is_completed: bool = False
    progress_percentage: float = 0.0
    watched_duration: int = 0  # in seconds
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class LiveDoubtSession(SQLModel, table=True):
    """Model for 1:1 live doubt resolution sessions"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    student_id: str = Field(foreign_key="user.id")
    instructor_id: Optional[str] = Field(foreign_key="user.id")
    subject: str
    topic: str
    doubt_description: str
    status: str = "pending"  # pending, active, completed, cancelled
    scheduled_time: Optional[datetime] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    resolution: Optional[str] = None
    video_call_url: Optional[str] = None
    rating: Optional[float] = None
    feedback: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AITeachingSession(SQLModel, table=True):
    """Model for AI virtual teaching agent sessions"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    subject: str
    topic: str
    class_id: Optional[str] = None
    ai_agent_version: str = "1.0"
    session_type: str = "interactive"  # interactive, explanation, quiz
    messages_count: int = 0
    duration_seconds: int = 0
    learning_progress: float = 0.0
    concepts_covered: list = Field(default_factory=list)
    user_questions: list = Field(default_factory=list)
    ai_explanations: list = Field(default_factory=list)
    comprehension_level: Optional[float] = None
    session_rating: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None