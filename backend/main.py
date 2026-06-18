from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
from sqlmodel import Session, select, SQLModel

# Import routes
from backend.routes import auth, exams, progress, admin, video_sessions
# Import models
from backend.models.models import User, Question, ExamAttempt
from backend.models.video_session import VideoSession, LiveDoubtSession, AITeachingSession
from backend.db import engine, get_session
from backend.storage import Storage

load_dotenv()

# Startup event
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    SQLModel.metadata.create_all(engine)
    
    # Seed initial data if database is empty
    session = Session(engine)
    try:
        existing_questions = session.exec(select(Question)).first()
        if not existing_questions:
            storage = Storage()
            storage.seed_questions()
    finally:
        session.close()
    
    yield
    # Shutdown (if needed)


# Create FastAPI app
app = FastAPI(
    title="VALLURI™ - Quantum AI IIT JEE Mock Tests",
    description="Next-generation agentic AI-powered mock testing and personalized coaching platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(exams.router)
app.include_router(progress.router)
app.include_router(admin.router)
app.include_router(video_sessions.router)

# Health check endpoint
@app.get("/")
def read_root():
    return {
        "message": "Welcome to VALLURI™ - Quantum AI IIT JEE Mock Tests",
        "status": "Server is running",
        "version": "1.0.0",
        "features": [
            "Mock Testing Engine",
            "Video Lessons with Progress Tracking",
            "1:1 Live Doubt Resolution",
            "Virtual AI Teaching Agent",
            "Performance Analytics",
            "Rank Predictor"
        ]
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "message": "All systems operational"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)