import os
import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from datetime import datetime
from sqlmodel import select, Session

from db import get_session
from models.db_models import User
from models.video_session import AITeachingSession, LiveDoubtSession, VideoSession
from routes.dependencies import get_current_user

router = APIRouter(prefix="/api/videos", tags=["Video Sessions"])


class VideoLessonCreate(BaseModel):
    title: str
    subject: str
    topic: str
    video_url: str
    duration_minutes: int
    description: str | None = None
    thumbnail_url: str | None = None
    instructor_name: str | None = None


class VideoProgressUpdate(BaseModel):
    watched_duration: int = Field(..., ge=0)


class DoubtSessionCreate(BaseModel):
    subject: str
    topic: str
    doubt_description: str
    scheduled_time: datetime | None = None


class DoubtSessionAccept(BaseModel):
    video_call_url: str | None = None


class DoubtSessionComplete(BaseModel):
    resolution: str


class DoubtSessionRating(BaseModel):
    rating: float = Field(..., ge=1, le=5)
    feedback: str | None = None


class AITeachingSessionCreate(BaseModel):
    subject: str
    topic: str
    class_id: str | None = None
    session_type: str = "interactive"


class AITeachingMessage(BaseModel):
    user_message: str


class AITeachingComplete(BaseModel):
    comprehension_level: float | None = None
    session_rating: float | None = None

# Sample video data
SAMPLE_VIDEOS = [
    {
        "title": "Kinematics Fundamentals",
        "subject": "Physics",
        "topic": "Kinematics",
        "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "duration_minutes": 45,
        "description": "Learn the basics of kinematics with real-world examples and detailed explanations.",
        "thumbnail_url": "https://via.placeholder.com/400x225?text=Kinematics+Fundamentals",
        "instructor_name": "Dr. Rajesh Kumar"
    },
    {
        "title": "Newton's Laws of Motion",
        "subject": "Physics",
        "topic": "Newton's Laws",
        "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "duration_minutes": 52,
        "description": "Deep dive into Newton's three laws of motion with practical applications.",
        "thumbnail_url": "https://via.placeholder.com/400x225?text=Newton+Laws",
        "instructor_name": "Dr. Rajesh Kumar"
    },
    {
        "title": "Chemical Bonding Explained",
        "subject": "Chemistry",
        "topic": "Chemical Bonding",
        "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "duration_minutes": 38,
        "description": "Understand ionic, covalent, and metallic bonding with visual demonstrations.",
        "thumbnail_url": "https://via.placeholder.com/400x225?text=Chemical+Bonding",
        "instructor_name": "Prof. Priya Singh"
    },
    {
        "title": "Periodic Table & Trends",
        "subject": "Chemistry",
        "topic": "Periodic Table",
        "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "duration_minutes": 41,
        "description": "Master periodic trends, electronegativity, and atomic radius variations.",
        "thumbnail_url": "https://via.placeholder.com/400x225?text=Periodic+Table",
        "instructor_name": "Prof. Priya Singh"
    },
    {
        "title": "Algebra Basics & Polynomials",
        "subject": "Mathematics",
        "topic": "Algebra",
        "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "duration_minutes": 55,
        "description": "Comprehensive coverage of algebraic expressions and polynomial equations.",
        "thumbnail_url": "https://via.placeholder.com/400x225?text=Algebra",
        "instructor_name": "Mr. Vikram Mehta"
    },
    {
        "title": "Calculus Integration Methods",
        "subject": "Mathematics",
        "topic": "Calculus",
        "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "duration_minutes": 60,
        "description": "Master various integration techniques and applications.",
        "thumbnail_url": "https://via.placeholder.com/400x225?text=Calculus",
        "instructor_name": "Mr. Vikram Mehta"
    }
]

# ==================== VIDEO LESSONS ====================

@router.post("/lessons")
def create_video_lesson(
    payload: VideoLessonCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new video lesson (Admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create video lessons")
    
    video_session = VideoSession(
        user_id=current_user.id,
        **payload.dict()
    )
    session.add(video_session)
    session.commit()
    session.refresh(video_session)
    return video_session

@router.get("/lessons")
def get_video_lessons(
    subject: str = Query(None),
    topic: str = Query(None),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get all available video lessons with optional filters"""
    # First try to get from database
    query = select(VideoSession)
    
    if subject:
        query = query.where(VideoSession.subject == subject)
    if topic:
        query = query.where(VideoSession.topic == topic)
    
    lessons = session.exec(query).all()
    
    # If no lessons in DB, return sample data
    if not lessons:
        filtered_samples = SAMPLE_VIDEOS
        if subject:
            filtered_samples = [v for v in filtered_samples if v["subject"] == subject]
        if topic:
            filtered_samples = [v for v in filtered_samples if v["topic"] == topic]
        return filtered_samples
    
    return lessons

@router.get("/lessons/{lesson_id}")
def get_video_lesson(
    lesson_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get a specific video lesson"""
    lesson = session.exec(
        select(VideoSession).where(VideoSession.id == lesson_id)
    ).first()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Video lesson not found")
    
    return lesson

@router.post("/lessons/{lesson_id}/progress")
def update_video_progress(
    lesson_id: str,
    payload: VideoProgressUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update video watch progress"""
    lesson = session.exec(
        select(VideoSession).where(VideoSession.id == lesson_id)
    ).first()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Video lesson not found")
    
    lesson.watched_duration = payload.watched_duration
    lesson.progress_percentage = min(100, (payload.watched_duration / (lesson.duration_minutes * 60)) * 100)
    
    if lesson.progress_percentage >= 90:
        lesson.is_completed = True
    
    lesson.updated_at = datetime.utcnow()
    session.add(lesson)
    session.commit()
    session.refresh(lesson)
    
    return {
        "message": "Progress updated",
        "progress_percentage": lesson.progress_percentage,
        "is_completed": lesson.is_completed
    }

@router.get("/my-progress")
def get_my_video_progress(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get current user's video progress"""
    lessons = session.exec(
        select(VideoSession).where(VideoSession.user_id == current_user.id)
    ).all()
    
    if not lessons:
        return {"message": "No video progress found", "lessons": []}
    
    total_progress = sum(lesson.progress_percentage for lesson in lessons) / len(lessons)
    completed = sum(1 for lesson in lessons if lesson.is_completed)
    
    return {
        "total_lessons": len(lessons),
        "completed_lessons": completed,
        "average_progress": total_progress,
        "lessons": [
            {
                "id": lesson.id,
                "title": lesson.title,
                "progress": lesson.progress_percentage,
                "is_completed": lesson.is_completed
            }
            for lesson in lessons
        ]
    }

# ==================== 1:1 LIVE DOUBT RESOLUTION ====================

@router.post("/doubts/sessions")
def create_doubt_session(
    payload: DoubtSessionCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new 1:1 doubt resolution session request"""
    doubt_session = LiveDoubtSession(
        student_id=current_user.id,
        subject=payload.subject,
        topic=payload.topic,
        doubt_description=payload.doubt_description,
        scheduled_time=payload.scheduled_time,
        status="pending"
    )
    session.add(doubt_session)
    session.commit()
    session.refresh(doubt_session)
    
    return {
        "message": "Doubt session created successfully",
        "session_id": doubt_session.id,
        "status": doubt_session.status
    }

@router.get("/doubts/sessions")
def get_doubt_sessions(
    status: str = Query(None),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get all doubt sessions for the current user"""
    query = select(LiveDoubtSession).where(LiveDoubtSession.student_id == current_user.id)
    
    if status:
        query = query.where(LiveDoubtSession.status == status)
    
    sessions = session.exec(query).all()
    return sessions

@router.get("/doubts/sessions/{session_id}")
def get_doubt_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get a specific doubt session"""
    doubt_session = session.exec(
        select(LiveDoubtSession).where(LiveDoubtSession.id == session_id)
    ).first()
    
    if not doubt_session:
        raise HTTPException(status_code=404, detail="Doubt session not found")
    
    if doubt_session.student_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    
    return doubt_session

@router.post("/doubts/sessions/{session_id}/accept")
def accept_doubt_session(
    session_id: str,
    payload: DoubtSessionAccept | None = None,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Accept a doubt resolution session (Instructor only)"""
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(status_code=403, detail="Only instructors can accept sessions")
    
    doubt_session = session.exec(
        select(LiveDoubtSession).where(LiveDoubtSession.id == session_id)
    ).first()
    
    if not doubt_session:
        raise HTTPException(status_code=404, detail="Doubt session not found")
    
    doubt_session.status = "active"
    doubt_session.instructor_id = current_user.id
    doubt_session.start_time = datetime.utcnow()
    if payload and payload.video_call_url:
        doubt_session.video_call_url = payload.video_call_url
    else:
        # Generate a dummy video call URL
        doubt_session.video_call_url = f"https://meet.jit.si/VALLURI_{session_id[:8]}"
    
    session.add(doubt_session)
    session.commit()
    session.refresh(doubt_session)
    
    return {
        "message": "Doubt session accepted",
        "session_id": doubt_session.id,
        "video_call_url": doubt_session.video_call_url
    }

@router.post("/doubts/sessions/{session_id}/complete")
def complete_doubt_session(
    session_id: str,
    payload: DoubtSessionComplete,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Complete a doubt resolution session"""
    doubt_session = session.exec(
        select(LiveDoubtSession).where(LiveDoubtSession.id == session_id)
    ).first()
    
    if not doubt_session:
        raise HTTPException(status_code=404, detail="Doubt session not found")
    
    if doubt_session.instructor_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only the assigned instructor can complete this session")
    
    doubt_session.status = "completed"
    doubt_session.end_time = datetime.utcnow()
    doubt_session.resolution = payload.resolution
    
    session.add(doubt_session)
    session.commit()
    session.refresh(doubt_session)
    
    return {
        "message": "Doubt session completed",
        "session_id": doubt_session.id
    }

@router.post("/doubts/sessions/{session_id}/rate")
def rate_doubt_session(
    session_id: str,
    payload: DoubtSessionRating,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Rate a completed doubt resolution session"""
    doubt_session = session.exec(
        select(LiveDoubtSession).where(LiveDoubtSession.id == session_id)
    ).first()
    
    if not doubt_session:
        raise HTTPException(status_code=404, detail="Doubt session not found")
    
    if doubt_session.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the student can rate this session")
    
    doubt_session.rating = payload.rating
    doubt_session.feedback = payload.feedback
    
    session.add(doubt_session)
    session.commit()
    session.refresh(doubt_session)
    
    return {"message": "Session rated successfully", "rating": payload.rating}

@router.get("/doubts/pending")
def get_pending_doubt_sessions(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get all pending doubt sessions (for instructors)"""
    if current_user.role not in ["instructor", "admin"]:
        raise HTTPException(status_code=403, detail="Only instructors can access this")
    
    sessions = session.exec(
        select(LiveDoubtSession).where(LiveDoubtSession.status == "pending")
    ).all()
    
    return sessions

# ==================== AI TEACHING AGENT ====================

@router.post("/ai-teaching/sessions")
def create_ai_teaching_session(
    payload: AITeachingSessionCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new AI teaching session"""
    ai_session = AITeachingSession(
        user_id=current_user.id,
        subject=payload.subject,
        topic=payload.topic,
        class_id=payload.class_id,
        session_type=payload.session_type
    )
    session.add(ai_session)
    session.commit()
    session.refresh(ai_session)
    
    return {
        "message": "AI teaching session created",
        "session_id": ai_session.id,
        "subject": ai_session.subject,
        "topic": ai_session.topic
    }

@router.get("/ai-teaching/sessions/{session_id}")
def get_ai_teaching_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get an AI teaching session"""
    ai_session = session.exec(
        select(AITeachingSession).where(AITeachingSession.id == session_id)
    ).first()
    
    if not ai_session:
        raise HTTPException(status_code=404, detail="AI teaching session not found")
    
    if ai_session.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    
    return ai_session

@router.post("/ai-teaching/sessions/{session_id}/message")
def send_message_to_ai(
    session_id: str,
    payload: AITeachingMessage,
    current_user: User = Depends(get_current_user),
    session_db: Session = Depends(get_session)
):
    """Send a message to the AI teaching agent"""
    ai_session = session_db.exec(
        select(AITeachingSession).where(AITeachingSession.id == session_id)
    ).first()
    
    if not ai_session:
        raise HTTPException(status_code=404, detail="AI teaching session not found")
    
    if ai_session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    ai_explanation = generate_ai_explanation(ai_session.subject, ai_session.topic, payload.user_message)
    
    if not isinstance(ai_session.user_questions, list):
        ai_session.user_questions = []
    if not isinstance(ai_session.ai_explanations, list):
        ai_session.ai_explanations = []
    
    ai_session.user_questions.append(payload.user_message)
    ai_session.ai_explanations.append(ai_explanation)
    ai_session.messages_count += 1
    
    session_db.add(ai_session)
    session_db.commit()
    session_db.refresh(ai_session)
    
    return {
        "user_message": payload.user_message,
        "ai_response": ai_explanation,
        "messages_count": ai_session.messages_count
    }

@router.post("/ai-teaching/sessions/{session_id}/complete")
def complete_ai_teaching_session(
    session_id: str,
    payload: AITeachingComplete,
    current_user: User = Depends(get_current_user),
    session_db: Session = Depends(get_session)
):
    """Complete an AI teaching session"""
    ai_session = session_db.exec(
        select(AITeachingSession).where(AITeachingSession.id == session_id)
    ).first()
    
    if not ai_session:
        raise HTTPException(status_code=404, detail="AI teaching session not found")
    
    if ai_session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    ai_session.completed_at = datetime.utcnow()
    ai_session.comprehension_level = payload.comprehension_level
    ai_session.session_rating = payload.session_rating
    
    session_db.add(ai_session)
    session_db.commit()
    session_db.refresh(ai_session)
    
    return {
        "message": "AI teaching session completed",
        "comprehension_level": payload.comprehension_level,
        "session_rating": payload.session_rating
    }

@router.get("/ai-teaching/my-sessions")
def get_my_ai_teaching_sessions(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get all AI teaching sessions for current user"""
    sessions = session.exec(
        select(AITeachingSession).where(AITeachingSession.user_id == current_user.id)
    ).all()
    
    return {
        "total_sessions": len(sessions),
        "sessions": [
            {
                "id": s.id,
                "subject": s.subject,
                "topic": s.topic,
                "messages": s.messages_count,
                "comprehension": s.comprehension_level,
                "rating": s.session_rating
            }
            for s in sessions
        ]
    }

def call_gemini_api_explanation(prompt: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return ""
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }
    try:
        response = httpx.post(url, json=payload, headers=headers, timeout=20.0)
        if response.status_code == 200:
            data = response.json()
            if "contents" in data and len(data["contents"]) > 0:
                parts = data["contents"][0].get("parts", [])
                if len(parts) > 0:
                    text = parts[0].get("text", "")
                    if text:
                        return text.strip()
    except Exception as e:
        print(f"Error calling Gemini API for video explanation: {e}")
    return ""


def generate_ai_explanation(subject: str, topic: str, user_query: str) -> str:
    prompt = f"""You are an expert IIT-JEE tutor. Create a detailed lesson explanation for the subject '{subject}', topic '{topic}', answering the student's question/topic of interest: '{user_query}'.
    
    You MUST format your explanation to contain exactly these 4 sections:
    
    1. **Topic Explanation**: Clear, rigorous conceptual explanation of the topic.
    2. **Key Formulas**: High-yield formulas or mathematical relations relevant to the topic.
    3. **Solved Illustrations**: Exactly 2 or 3 solved step-by-step examples/illustrations.
    4. **Real-Life Example**: Exactly 1 detailed real-life or engineering application of this concept.
    
    Use neat Markdown.
    """
    
    reply = call_gemini_api_explanation(prompt)
    if reply:
        return reply

    # Fallback structured explanation
    return f"""### Lesson Explanation: {topic} ({subject})

#### 1. Topic Explanation
In **{subject}**, the topic **{topic}** represents a fundamental concept tested in IIT-JEE. 
The concept details the physical or mathematical behavior of the system, laying out coordinates, constraints, and boundary assumptions.

#### 2. Key Formulas
- **Primary Equation**: $E = h\\nu = \\frac{{hc}}{{\\lambda}}$ (energy transition or relation)
- **State Constraint**: $P V = n R T$ or $F = m a$ (system equilibrium condition)
- **Error/Symmetry Rules**: Ensure proper conversions to SI units (m, kg, s, K).

#### 3. Solved Illustrations
- **Illustration 1**: Find the value of parameters given initial boundary conditions.
  - *Solution*: Identify the formula, substitute values carefully (checking for sign conventions), and solve step-by-step.
- **Illustration 2**: A standard JEE multi-stage problem involving ratios.
  - *Solution*: Divide initial and final equations, cancel common constants, and evaluate the final ratio.

#### 4. Real-Life Example
In industrial machinery and daily engineering, the principles of **{topic}** are applied to calibrate sensors, estimate energy efficiency, and design safety margins. For instance, sensors measuring small variations in physical properties depend on these relations to calculate precise outcomes.
"""
