from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from db import get_session
from models.schemas import StudentSelection
from routes.dependencies import get_current_user
from storage import get_user_by_email, update_student_selection

router = APIRouter(prefix="/api/student", tags=["Student"])


@router.post("/selection")
def save_student_selection(
    selection: StudentSelection,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    update_student_selection(session, current_user.email, selection.subject, selection.topic)

    return {
        "message": "Selection saved successfully",
        "selected_subject": selection.subject,
        "selected_topic": selection.topic,
    }


@router.get("/selection")
def get_student_selection(
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    user = get_user_by_email(session, current_user.email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return {
        "selected_subject": user.selected_subject,
        "selected_topic": user.selected_topic,
    }
