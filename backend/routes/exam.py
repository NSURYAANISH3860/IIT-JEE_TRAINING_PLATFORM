from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from db import get_session
from models.schemas import ExamResult, ExamSubmission, ExamAttemptOut, QuestionOut
from routes.dependencies import get_current_user
from storage import create_exam_attempt, get_question_by_id, get_questions_for_exam, get_user_attempts, get_leaderboard

router = APIRouter(prefix="/api/exams", tags=["Exams"])


@router.get("/questions", response_model=list[QuestionOut])
def list_questions(
    subject: str | None = None,
    topic: str | None = None,
    limit: int = 10,
    session: Session = Depends(get_session),
    _: object = Depends(get_current_user),
):
    questions = get_questions_for_exam(session, subject, topic, limit)
    return [QuestionOut.from_orm(question) for question in questions]


@router.post("/submit", response_model=ExamResult)
def submit_exam(
    submission: ExamSubmission,
    session: Session = Depends(get_session),
    current_user: object = Depends(get_current_user),
):
    if len(submission.answers) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one answer is required.",
        )

    details = []
    correct_answers = 0
    for answer in submission.answers:
        question = get_question_by_id(session, answer.question_id)
        if not question:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Question {answer.question_id} not found.",
            )

        is_correct = answer.selected_option.strip().lower() == question.correct_option.strip().lower()
        if is_correct:
            correct_answers += 1

        details.append(
            {
                "question_id": question.id,
                "subject": question.subject,
                "topic": question.topic,
                "selected_option": answer.selected_option,
                "correct_option": question.correct_option,
                "is_correct": is_correct,
                "explanation": question.explanation,
            }
        )

    total_questions = len(submission.answers)
    score = round((correct_answers / total_questions) * 100, 2)
    percentage = score

    create_exam_attempt(
        session=session,
        user_id=current_user.id,
        subject=submission.subject,
        topic=submission.topic,
        total_questions=total_questions,
        correct_answers=correct_answers,
        score=score,
        duration_seconds=submission.duration_seconds,
        details=details,
    )

    return ExamResult(
        total_questions=total_questions,
        correct_answers=correct_answers,
        score=score,
        percentage=percentage,
        details=details,
    )


@router.get("/history", response_model=list[ExamAttemptOut])
def exam_history(
    session: Session = Depends(get_session),
    current_user: object = Depends(get_current_user),
):
    attempts = get_user_attempts(session, current_user.id)
    return [ExamAttemptOut.from_orm(attempt) for attempt in attempts]


@router.get("/leaderboard", response_model=list[ExamAttemptOut])
def leaderboard(
    subject: str | None = None,
    topic: str | None = None,
    limit: int = 10,
    session: Session = Depends(get_session),
    _: object = Depends(get_current_user),
):
    attempts = get_leaderboard(session, subject, topic, limit)
    return [ExamAttemptOut.from_orm(attempt) for attempt in attempts]
