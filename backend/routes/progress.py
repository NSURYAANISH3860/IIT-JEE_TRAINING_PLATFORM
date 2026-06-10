from fastapi import APIRouter, Depends
from sqlmodel import Session

from db import get_session
from models.schemas import ProgressSummary
from routes.dependencies import get_current_user
from storage import get_progress_summary

router = APIRouter(prefix="/api/progress", tags=["Progress"])


@router.get("/summary", response_model=ProgressSummary)
def summary(
    session: Session = Depends(get_session),
    current_user: object = Depends(get_current_user),
):
    return get_progress_summary(session, current_user.id)
