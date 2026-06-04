from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class InquiryBase(BaseModel):
    full_name: str = Field(min_length=1, max_length=100)
    company_name: Optional[str] = Field(default=None, max_length=200)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=20)
    subject: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=1)


class InquiryCreate(InquiryBase):
    pass


class InquiryResponse(InquiryBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    is_read: bool
    created_at: datetime


class InquiryMarkRead(BaseModel):
    is_read: bool
