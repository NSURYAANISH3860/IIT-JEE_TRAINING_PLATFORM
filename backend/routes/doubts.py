from datetime import datetime
from fastapi import APIRouter, Depends
from sqlmodel import Session

from db import get_session
from models.schemas import DoubtCreate, DoubtOut, DoubtUpdate
from routes.dependencies import get_current_user
from storage import create_doubt, list_user_doubts, update_doubt
from mongodb import get_mongodb

router = APIRouter(prefix="/api/doubts", tags=["Doubts"])


@router.get("", response_model=list[DoubtOut])
def get_doubts(
    status: str | None = None,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    return list_user_doubts(session, current_user.id, status)


@router.post("", response_model=DoubtOut, status_code=201)
async def submit_doubt(
    payload: DoubtCreate,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
    mongo_db=Depends(get_mongodb)
):
    doubt = create_doubt(session, current_user.id, payload)
    
    # Audit log to MongoDB
    if mongo_db is not None:
        try:
            audit_log = {
                "action": "create",
                "doubt_id": doubt.id,
                "user_id": current_user.id,
                "subject": payload.subject,
                "topic": payload.topic,
                "question": payload.question,
                "timestamp": datetime.utcnow()
            }
            await mongo_db.doubts_audit_logs.insert_one(audit_log)
        except Exception as e:
            print(f"Error saving doubt creation log to MongoDB: {e}")

    return doubt


@router.patch("/{doubt_id}", response_model=DoubtOut)
async def edit_doubt(
    doubt_id: str,
    payload: DoubtUpdate,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
    mongo_db=Depends(get_mongodb)
):
    doubt = update_doubt(session, doubt_id, current_user.id, payload)
    
    # Audit log to MongoDB
    if mongo_db is not None:
        try:
            audit_log = {
                "action": "update",
                "doubt_id": doubt_id,
                "user_id": current_user.id,
                "updated_fields": payload.dict(exclude_unset=True),
                "timestamp": datetime.utcnow()
            }
            await mongo_db.doubts_audit_logs.insert_one(audit_log)
        except Exception as e:
            print(f"Error saving doubt edit log to MongoDB: {e}")

    return doubt
