from collections import defaultdict
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from models.db_models import ExamAttempt, Question, User, UserActivity
from models.schemas import QuestionCreate, QuestionUpdate


def create_user(session: Session, user_data: dict) -> User:
    user = User(**user_data)
    session.add(user)

    try:
        session.commit()
        session.refresh(user)
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists",
        )

    return user


def get_user_by_email(session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email.strip().lower())
    return session.exec(statement).one_or_none()


def get_user_by_id(session: Session, user_id: str) -> User | None:
    statement = select(User).where(User.id == user_id)
    return session.exec(statement).one_or_none()


def update_student_selection(session: Session, email: str, subject: str, topic: str) -> User:
    user = get_user_by_email(session, email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.selected_subject = subject
    user.selected_topic = topic
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def create_question(session: Session, payload: QuestionCreate) -> Question:
    question = Question(**payload.dict())
    session.add(question)
    session.commit()
    session.refresh(question)
    return question


def list_questions(session: Session) -> list[Question]:
    statement = select(Question).order_by(Question.created_at.desc())
    return session.exec(statement).all()


def get_question_by_id(session: Session, question_id: str) -> Question | None:
    statement = select(Question).where(Question.id == question_id)
    return session.exec(statement).one_or_none()


def update_question(session: Session, question_id: str, payload: QuestionUpdate) -> Question:
    question = get_question_by_id(session, question_id)

    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found",
        )

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(question, field, value)

    session.add(question)
    session.commit()
    session.refresh(question)
    return question


def delete_question(session: Session, question_id: str) -> None:
    question = get_question_by_id(session, question_id)
    if question:
        session.delete(question)
        session.commit()


def get_questions_for_exam(
    session: Session,
    subject: str | None = None,
    topic: str | None = None,
    limit: int = 10,
) -> list[Question]:
    statement = select(Question)
    if subject:
        statement = statement.where(func.lower(Question.subject) == subject.strip().lower())
    if topic:
        statement = statement.where(func.lower(Question.topic) == topic.strip().lower())
    statement = statement.order_by(func.random()).limit(limit)
    return session.exec(statement).all()


def create_exam_attempt(
    session: Session,
    user_id: str,
    subject: str,
    topic: str,
    total_questions: int,
    correct_answers: int,
    score: float,
    duration_seconds: int,
    details: list[dict[str, Any]],
) -> ExamAttempt:
    attempt = ExamAttempt(
        user_id=user_id,
        subject=subject,
        topic=topic,
        total_questions=total_questions,
        correct_answers=correct_answers,
        score=score,
        duration_seconds=duration_seconds,
        details=details,
    )
    session.add(attempt)
    session.commit()
    session.refresh(attempt)
    return attempt


def get_user_attempts(session: Session, user_id: str) -> list[ExamAttempt]:
    statement = select(ExamAttempt).where(ExamAttempt.user_id == user_id).order_by(ExamAttempt.created_at.desc())
    return session.exec(statement).all()


def get_leaderboard(
    session: Session,
    subject: str | None = None,
    topic: str | None = None,
    limit: int = 10,
) -> list[ExamAttempt]:
    statement = select(ExamAttempt)
    if subject:
        statement = statement.where(func.lower(ExamAttempt.subject) == subject.strip().lower())
    if topic:
        statement = statement.where(func.lower(ExamAttempt.topic) == topic.strip().lower())
    statement = statement.order_by(ExamAttempt.score.desc(), ExamAttempt.created_at.desc()).limit(limit)
    return session.exec(statement).all()


def get_progress_summary(session: Session, user_id: str) -> dict[str, Any]:
    attempts = get_user_attempts(session, user_id)
    total_attempts = len(attempts)

    if total_attempts == 0:
        return {
            "total_attempts": 0,
            "average_score": 0.0,
            "best_score": 0.0,
            "recent_attempts": [],
            "subject_accuracy": {},
            "weak_topics": {},
        }

    total_score = 0.0
    subject_counts: dict[str, int] = defaultdict(int)
    subject_correct: dict[str, int] = defaultdict(int)
    topic_counts: dict[str, int] = defaultdict(int)
    topic_correct: dict[str, int] = defaultdict(int)

    for attempt in attempts:
        total_score += attempt.score
        for item in attempt.details:
            subject = item.get("subject", "unknown")
            topic = item.get("topic", "unknown")
            is_correct = bool(item.get("is_correct"))
            subject_counts[subject] += 1
            topic_counts[topic] += 1
            if is_correct:
                subject_correct[subject] += 1
                topic_correct[topic] += 1

    subject_accuracy = {
        subject: round((subject_correct[subject] / subject_counts[subject]) * 100, 2)
        for subject in subject_counts
    }

    weak_topics = {
        topic: round((topic_correct[topic] / topic_counts[topic]) * 100, 2)
        for topic in topic_counts
    }

    weak_topics = dict(sorted(weak_topics.items(), key=lambda item: item[1]))

    return {
        "total_attempts": total_attempts,
        "average_score": round(total_score / total_attempts, 2),
        "best_score": max(attempt.score for attempt in attempts),
        "recent_attempts": [attempt for attempt in attempts[:5]],
        "subject_accuracy": subject_accuracy,
        "weak_topics": weak_topics,
    }


def create_default_questions(session: Session) -> None:
    statement = select(Question)
    existing = session.exec(statement).first()
    if existing:
        return

    sample_questions = [
        Question(
            exam_type="jee_mains",
            subject="Physics",
            topic="Kinematics",
            question_text="A body starts from rest and moves with constant acceleration 2 m/s^2. What is its speed after 5 seconds?",
            options=["10 m/s", "7.5 m/s", "5 m/s", "12 m/s"],
            correct_option="10 m/s",
            explanation="The speed is a*t = 2 * 5 = 10 m/s.",
        ),
        Question(
            exam_type="jee_mains",
            subject="Chemistry",
            topic="Chemical Bonding",
            question_text="Which of the following molecules has a trigonal planar geometry?",
            options=["CH4", "BF3", "NH3", "H2O"],
            correct_option="BF3",
            explanation="BF3 has three bonding pairs and no lone pairs, making it trigonal planar.",
        ),
        Question(
            exam_type="jee_mains",
            subject="Mathematics",
            topic="Algebra",
            question_text="What is the value of x if 2x + 5 = 13?",
            options=["4", "6", "3", "8"],
            correct_option="4",
            explanation="2x = 8, so x = 4.",
        ),
    ]
    session.add_all(sample_questions)
    session.commit()


def create_user_activity(
    session: Session,
    user_id: str,
    activity_type: str,
    title: str,
    subject: str,
    duration_seconds: int | None = None,
    score: float | None = None,
    extra_info: dict[str, Any] | None = None,
) -> UserActivity:
    activity = UserActivity(
        user_id=user_id,
        activity_type=activity_type,
        title=title,
        subject=subject,
        duration_seconds=duration_seconds,
        score=score,
        extra_info=extra_info or {},
    )
    session.add(activity)
    session.commit()
    session.refresh(activity)
    return activity


def get_user_activities(
    session: Session,
    user_id: str,
    limit: int = 50,
) -> list[UserActivity]:
    statement = (
        select(UserActivity)
        .where(UserActivity.user_id == user_id)
        .order_by(UserActivity.created_at.desc())
        .limit(limit)
    )
    return session.exec(statement).all()
