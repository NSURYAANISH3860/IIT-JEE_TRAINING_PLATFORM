import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from db import create_db_and_tables, engine
from routes.admin import router as admin_router
from routes.auth import router as auth_router
from routes.exam import router as exam_router
from routes.progress import router as progress_router
from routes.student import router as student_router
from storage import create_default_questions


load_dotenv()

app = FastAPI(
    title="Quantum AI IIT JEE Backend",
    description="Backend for Quantum AI IIT JEE Mock Tests with authentication, exams, and progress tracking.",
    version="1.0.0",
)

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


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    with Session(engine) as session:
        create_default_questions(session)


@app.get("/")
def health_check():
    return {"message": "Quantum AI IIT JEE Backend is running"}

