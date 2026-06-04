from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID
from typing import Optional


class InquiryCreate(BaseModel):
    full_name: str
    company_name: Optional[str] = None
    email: EmailStr
    phone: str
    subject: str
    message: str


class InquiryResponse(BaseModel):
    id: UUID
    full_name: str
    company_name: Optional[str] = None
    email: str
    phone: str
    subject: str
    message: str
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class InquiryMarkRead(BaseModel):
    is_read: bool
