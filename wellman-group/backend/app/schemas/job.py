from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ── Job Application ───────────────────────────────────────────────────────────

class JobApplicationBase(BaseModel):
    applicant_name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=20)
    resume_url: str = Field(min_length=1, max_length=500)
    cover_letter: Optional[str] = Field(default=None, max_length=5000)


class JobApplicationCreate(JobApplicationBase):
    pass


class JobApplicationResponse(JobApplicationBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    job_id: UUID
    is_read: bool
    applied_at: datetime


# ── Job Opening ───────────────────────────────────────────────────────────────

class JobOpeningBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    department: str = Field(min_length=1, max_length=100)
    location: str = Field(min_length=1, max_length=200)
    job_type: str = Field(min_length=1, max_length=50)
    description: str
    responsibilities: str
    requirements: str
    is_open: bool = True


class JobOpeningCreate(JobOpeningBase):
    pass


class JobOpeningUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    department: Optional[str] = Field(default=None, min_length=1, max_length=100)
    location: Optional[str] = Field(default=None, min_length=1, max_length=200)
    job_type: Optional[str] = Field(default=None, min_length=1, max_length=50)
    description: Optional[str] = None
    responsibilities: Optional[str] = None
    requirements: Optional[str] = None
    is_open: Optional[bool] = None


class JobOpeningListResponse(JobOpeningBase):
    """Lightweight response for list endpoints — applications excluded."""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime


class JobOpeningResponse(JobOpeningBase):
    """Full response with nested applications — for admin detail endpoints."""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime
    applications: list[JobApplicationResponse] = []


class JobOpeningToggle(BaseModel):
    is_open: bool
