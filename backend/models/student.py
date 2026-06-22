from pydantic import BaseModel, Field


class StudentSelection(BaseModel):
    subject: str = Field(..., min_length=2)
    topic: str = Field(..., min_length=2)
