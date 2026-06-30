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
    exam_type: str | None = None,
    limit: int = 10,
    session: Session = Depends(get_session),
    _: object = Depends(get_current_user),
):
    questions = get_questions_for_exam(session, subject, topic, exam_type, limit)
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
    obtained_marks = 0.0
    total_marks = 0.0

    for answer in submission.answers:
        question = get_question_by_id(session, answer.question_id)
        if not question:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Question {answer.question_id} not found.",
            )

        is_correct = False
        marks_for_q = 0.0
        max_marks_for_q = 0.0

        user_ans = answer.selected_option.strip()

        # Check question type
        is_numerical = not question.options or len(question.options) == 0
        is_multicorrect = "," in question.correct_option and question.exam_type == "jee_advanced"

        if is_numerical:
            # Numerical Question
            max_marks_for_q = 4.0 if question.exam_type == "jee_mains" else 3.0
            if user_ans:
                # Try float comparison
                try:
                    user_val = float(user_ans)
                    correct_val = float(question.correct_option)
                    is_correct = abs(user_val - correct_val) < 1e-4
                except ValueError:
                    is_correct = user_ans.lower() == question.correct_option.strip().lower()

                if is_correct:
                    marks_for_q = max_marks_for_q
                    correct_answers += 1
                else:
                    marks_for_q = -1.0 if question.exam_type == "jee_mains" else 0.0
            else:
                marks_for_q = 0.0
        elif is_multicorrect:
            # Multi-correct Option Question (JEE Advanced)
            max_marks_for_q = 4.0
            if user_ans:
                user_opts = {o.strip().lower() for o in user_ans.split(",") if o.strip()}
                correct_opts = {o.strip().lower() for o in question.correct_option.split(",") if o.strip()}

                if user_opts == correct_opts:
                    is_correct = True
                    marks_for_q = 4.0
                    correct_answers += 1
                elif user_opts.issubset(correct_opts) and len(user_opts) > 0:
                    is_correct = True
                    # Partial marks rule: +1 for each correct option selected
                    marks_for_q = float(len(user_opts))
                else:
                    # Incorrect option chosen
                    is_correct = False
                    marks_for_q = -2.0
            else:
                marks_for_q = 0.0
        else:
            # Single-correct MCQ
            max_marks_for_q = 4.0 if question.exam_type == "jee_mains" else 3.0
            if user_ans:
                is_correct = user_ans.lower() == question.correct_option.strip().lower()
                if is_correct:
                    marks_for_q = max_marks_for_q
                    correct_answers += 1
                else:
                    marks_for_q = -1.0
            else:
                marks_for_q = 0.0

        obtained_marks += marks_for_q
        total_marks += max_marks_for_q

        details.append(
            {
                "question_id": question.id,
                "subject": question.subject,
                "topic": question.topic,
                "selected_option": answer.selected_option,
                "correct_option": question.correct_option,
                "is_correct": is_correct,
                "explanation": question.explanation,
                "marks_obtained": marks_for_q,
                "max_marks": max_marks_for_q,
            }
        )

    total_questions = len(submission.answers)
    
    # Calculate score percentage (clamped to 0 for database score representation)
    score_percentage = round((obtained_marks / total_marks) * 100, 2) if total_marks > 0 else 0.0
    score_percentage = max(0.0, score_percentage)

    create_exam_attempt(
        session=session,
        user_id=current_user.id,
        subject=submission.subject,
        topic=submission.topic,
        total_questions=total_questions,
        correct_answers=correct_answers,
        score=score_percentage,
        duration_seconds=submission.duration_seconds,
        details=details,
    )

    return ExamResult(
        total_questions=total_questions,
        correct_answers=correct_answers,
        score=score_percentage,
        percentage=score_percentage,
        details=details,
        obtained_marks=obtained_marks,
        total_marks=total_marks,
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
