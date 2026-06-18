from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from datetime import datetime
from backend.authentication.auth import get_current_user
from backend.storage import Storage
from backend.models.video_session import VideoSession, LiveDoubtSession, AITeachingSession
from backend.models.models import User
from sqlmodel import select, Session
from backend.db import get_session

router = APIRouter(prefix="/api/videos", tags=["Video Sessions"])
storage = Storage()

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
    title: str,
    subject: str,
    topic: str,
    video_url: str,
    duration_minutes: int,
    description: str = None,
    thumbnail_url: str = None,
    instructor_name: str = None,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new video lesson (Admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create video lessons")
    
    video_session = VideoSession(
        user_id=current_user.id,
        title=title,
        subject=subject,
        topic=topic,
        video_url=video_url,
        duration_minutes=duration_minutes,
        description=description,
        thumbnail_url=thumbnail_url,
        instructor_name=instructor_name
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
    watched_duration: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update video watch progress"""
    lesson = session.exec(
        select(VideoSession).where(VideoSession.id == lesson_id)
    ).first()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Video lesson not found")
    
    lesson.watched_duration = watched_duration
    lesson.progress_percentage = min(100, (watched_duration / (lesson.duration_minutes * 60)) * 100)
    
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
    subject: str,
    topic: str,
    doubt_description: str,
    scheduled_time: datetime = None,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new 1:1 doubt resolution session request"""
    doubt_session = LiveDoubtSession(
        student_id=current_user.id,
        subject=subject,
        topic=topic,
        doubt_description=doubt_description,
        scheduled_time=scheduled_time,
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
    video_call_url: str = None,
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
    if video_call_url:
        doubt_session.video_call_url = video_call_url
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
    resolution: str,
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
    doubt_session.resolution = resolution
    
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
    rating: float,
    feedback: str = None,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Rate a completed doubt resolution session"""
    if not (1 <= rating <= 5):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    doubt_session = session.exec(
        select(LiveDoubtSession).where(LiveDoubtSession.id == session_id)
    ).first()
    
    if not doubt_session:
        raise HTTPException(status_code=404, detail="Doubt session not found")
    
    if doubt_session.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the student can rate this session")
    
    doubt_session.rating = rating
    doubt_session.feedback = feedback
    
    session.add(doubt_session)
    session.commit()
    session.refresh(doubt_session)
    
    return {"message": "Session rated successfully", "rating": rating}

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
    subject: str,
    topic: str,
    class_id: str = None,
    session_type: str = "interactive",
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new AI teaching session"""
    ai_session = AITeachingSession(
        user_id=current_user.id,
        subject=subject,
        topic=topic,
        class_id=class_id,
        session_type=session_type
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
    user_message: str,
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
    
    ai_explanation = generate_ai_explanation(ai_session.subject, ai_session.topic, user_message)
    
    if not isinstance(ai_session.user_questions, list):
        ai_session.user_questions = []
    if not isinstance(ai_session.ai_explanations, list):
        ai_session.ai_explanations = []
    
    ai_session.user_questions.append(user_message)
    ai_session.ai_explanations.append(ai_explanation)
    ai_session.messages_count += 1
    
    session_db.add(ai_session)
    session_db.commit()
    session_db.refresh(ai_session)
    
    return {
        "user_message": user_message,
        "ai_response": ai_explanation,
        "messages_count": ai_session.messages_count
    }

@router.post("/ai-teaching/sessions/{session_id}/complete")
def complete_ai_teaching_session(
    session_id: str,
    comprehension_level: float = None,
    session_rating: float = None,
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
    ai_session.comprehension_level = comprehension_level
    ai_session.session_rating = session_rating
    
    session_db.add(ai_session)
    session_db.commit()
    session_db.refresh(ai_session)
    
    return {
        "message": "AI teaching session completed",
        "comprehension_level": comprehension_level,
        "session_rating": session_rating
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

def generate_ai_explanation(subject: str, topic: str, user_query: str) -> str:
    """
    Generate AI explanation for a user query
    
    Comprehensive explanations based on subject and topic
    """
    
    physics_explanations = {
        "Kinematics": f"""
**Kinematics Concept - {user_query}**

**Definition:**
Kinematics is the branch of physics that describes motion without considering the forces that cause it.

**Key Concepts:**
1. **Displacement (s)**: Vector quantity measuring position change
2. **Velocity (v)**: Rate of change of displacement
3. **Acceleration (a)**: Rate of change of velocity

**Equations of Motion:**
- v = u + at
- s = ut + ½at²
- v² = u² + 2as

**Real-World Application:**
When a car accelerates from rest to 100 km/h in 10 seconds, kinematics helps us calculate the distance traveled and acceleration.

**Your Question:** {user_query}

**Solution Approach:**
1. Identify initial conditions
2. Apply appropriate kinematic equation
3. Calculate the required quantity
        """,
        
        "Newton's Laws": f"""
**Newton's Laws of Motion - {user_query}**

**First Law (Law of Inertia):**
An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.

**Second Law:**
F = ma
The acceleration of an object is directly proportional to the net force and inversely proportional to its mass.

**Third Law:**
For every action, there is an equal and opposite reaction.

**Practical Examples:**
1. Seat belts prevent forward motion due to inertia
2. Rocket propulsion works on the third law
3. Heavier objects need more force to accelerate

**Your Question:** {user_query}
        """
    }
    
    chemistry_explanations = {
        "Chemical Bonding": f"""
**Chemical Bonding - {user_query}**

**Types of Chemical Bonds:**

1. **Ionic Bond:**
   - Formed between metal and non-metal
   - Transfer of electrons
   - Example: NaCl (Sodium Chloride)

2. **Covalent Bond:**
   - Formed between two non-metals
   - Sharing of electrons
   - Example: H₂O (Water)

3. **Metallic Bond:**
   - Formed between metal atoms
   - Sea of electrons
   - Example: Copper, Iron

**Bond Strength:**
Ionic > Covalent > Metallic

**Your Question:** {user_query}

**Key Points to Remember:**
- Electronegativity difference determines bond type
- Stability depends on electron configuration
- Lewis structures help visualize bonds
        """,
        
        "Periodic Table": f"""
**Periodic Table & Trends - {user_query}**

**Important Trends:**

1. **Atomic Radius:**
   - Decreases across a period
   - Increases down a group

2. **Electronegativity:**
   - Increases across a period
   - Decreases down a group

3. **Ionization Energy:**
   - Increases across a period
   - Decreases down a group

**Period & Group:**
- Period: Horizontal rows (1-7)
- Group: Vertical columns (1-18)

**Your Question:** {user_query}

**Memory Aid:**
Think of periodic table as a map where position determines properties!
        """
    }
    
    math_explanations = {
        "Algebra": f"""
**Algebra Basics & Polynomials - {user_query}**

**Key Concepts:**

1. **Variables:** Symbols representing unknown values (x, y, z)
2. **Coefficients:** Numbers multiplying variables
3. **Terms:** Individual components (3x, 5y², -7)
4. **Polynomials:** Sum of terms with whole number exponents

**Degree of Polynomial:**
Highest power of variable

**Types of Polynomials:**
- Linear: ax + b (degree 1)
- Quadratic: ax² + bx + c (degree 2)
- Cubic: ax³ + bx² + cx + d (degree 3)

**Your Question:** {user_query}

**Solving Method:**
1. Simplify both sides
2. Move variables to one side
3. Solve for variable
        """,
        
        "Calculus": f"""
**Calculus Integration Methods - {user_query}**

**Integration Basics:**
Integration is the reverse of differentiation.

**Integration Formulas:**
- ∫xⁿ dx = xⁿ⁺¹/(n+1) + C
- ∫e^x dx = e^x + C
- ∫sin(x) dx = -cos(x) + C
- ∫cos(x) dx = sin(x) + C

**Integration Methods:**

1. **Substitution Method:**
   Used when integral contains composite function
   
2. **Integration by Parts:**
   ∫u dv = uv - ∫v du

3. **Partial Fractions:**
   Used for rational functions

**Your Question:** {user_query}

**Practice Tip:**
Always add the constant of integration (+ C) to indefinite integrals!
        """
    }
    
    # Select appropriate explanation
    if subject == "Physics":
        return physics_explanations.get(topic, f"Physics - {topic}: {user_query}\n\nThis is where detailed explanations would appear.")
    elif subject == "Chemistry":
        return chemistry_explanations.get(topic, f"Chemistry - {topic}: {user_query}\n\nThis is where detailed explanations would appear.")
    elif subject == "Mathematics":
        return math_explanations.get(topic, f"Mathematics - {topic}: {user_query}\n\nThis is where detailed explanations would appear.")
    else:
        return f"Let me explain {topic} in {subject} detail:\n\n{user_query}\n\nFor a comprehensive understanding, let's break this down into key concepts..."