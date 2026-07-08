import os
from collections import defaultdict
import time

from dotenv import load_dotenv
from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select, SQLModel

from db import create_db_and_tables, engine
from storage import create_default_questions
from mongodb import db_manager

# Import routers
from routes.admin import router as admin_router
from routes.auth import router as auth_router
from routes.content import router as content_router
from routes.doubts import router as doubts_router
from routes.exam import router as exam_router
from routes.progress import router as progress_router
from routes.student import router as student_router
from routes.ai import router as ai_router
from routes.video_sessions import router as video_sessions_router

load_dotenv()

app = FastAPI(
    title="VALLURI™ - Quantum AI IIT JEE Mock Tests",
    description="Next-generation agentic AI-powered mock testing and personalized coaching platform",
    version="1.0.0",
)

RATE_LIMIT_DURATION = 60  # seconds
MAX_REQUESTS_PER_IP = 150  # limit per IP

ip_request_history = defaultdict(list)

@app.middleware("http")
async def security_and_rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"
    current_time = time.time()
    
    # Clean up request history older than the duration window
    ip_request_history[client_ip] = [
        t for t in ip_request_history[client_ip]
        if current_time - t < RATE_LIMIT_DURATION
    ]
    
    if len(ip_request_history[client_ip]) >= MAX_REQUESTS_PER_IP:
        return Response(
            content='{"detail": "Too many requests. Please try again in a minute."}',
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            media_type="application/json"
        )
        
    ip_request_history[client_ip].append(current_time)
    
    # Proceed to retrieve response
    response = await call_next(request)
    
    # Append Security Headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self' *; "
        "style-src 'self' 'unsafe-inline' *; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' *"
    )
    return response

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(student_router)
app.include_router(exam_router)
app.include_router(progress_router)
app.include_router(admin_router)
app.include_router(doubts_router)
app.include_router(content_router)
app.include_router(ai_router)
app.include_router(video_sessions_router)

@app.on_event("startup")
async def on_startup():
    create_db_and_tables()
    with Session(engine) as session:
        create_default_questions(session)
    db_manager.connect()


@app.on_event("shutdown")
async def on_shutdown():
    db_manager.disconnect()

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
