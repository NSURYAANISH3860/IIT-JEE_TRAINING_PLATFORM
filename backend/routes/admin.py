from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from db import get_session
from models.schemas import QuestionCreate, QuestionUpdate, QuestionOut
from routes.dependencies import require_admin
from storage import create_question, get_question_by_id, list_questions, update_question, delete_question

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.post("/questions", response_model=QuestionOut, status_code=status.HTTP_201_CREATED)
def add_question(
    payload: QuestionCreate,
    session: Session = Depends(get_session),
    _: object = Depends(require_admin),
):
    question = create_question(session, payload)
    return QuestionOut.from_orm(question)


@router.get("/questions", response_model=list[QuestionOut])
def get_questions(
    session: Session = Depends(get_session),
    _: object = Depends(require_admin),
):
    questions = list_questions(session)
    return [QuestionOut.from_orm(question) for question in questions]


@router.put("/questions/{question_id}", response_model=QuestionOut)
def edit_question(
    question_id: str,
    payload: QuestionUpdate,
    session: Session = Depends(get_session),
    _: object = Depends(require_admin),
):
    question = get_question_by_id(session, question_id)
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found",
        )
    updated = update_question(session, question_id, payload)
    return QuestionOut.from_orm(updated)


@router.delete("/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_question(
    question_id: str,
    session: Session = Depends(get_session),
    _: object = Depends(require_admin),
):
    question = get_question_by_id(session, question_id)
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found",
        )
    delete_question(session, question_id)
