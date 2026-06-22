from fastapi import APIRouter, Depends
from sqlmodel import Session

from db import get_session
from models.schemas import DoubtCreate, DoubtOut, DoubtUpdate
from routes.dependencies import get_current_user
from storage import create_doubt, list_user_doubts, update_doubt

router = APIRouter(prefix="/api/doubts", tags=["Doubts"])


@router.get("", response_model=list[DoubtOut])
def get_doubts(
    status: str | None = None,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    return list_user_doubts(session, current_user.id, status)


@router.post("", response_model=DoubtOut, status_code=201)
def submit_doubt(
    payload: DoubtCreate,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    return create_doubt(session, current_user.id, payload)


@router.patch("/{doubt_id}", response_model=DoubtOut)
def edit_doubt(
    doubt_id: str,
    payload: DoubtUpdate,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    return update_doubt(session, doubt_id, current_user.id, payload)
