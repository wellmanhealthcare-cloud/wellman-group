from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID
from typing import Optional, List


class JobApplicationCreate(BaseModel):
    applicant_name: str
    email: EmailStr
    phone: str
    resume_url: str
    cover_letter: Optional[str] = None


class JobApplicationResponse(BaseModel):
    id: UUID
    job_id: UUID
    applicant_name: str
    email: str
    phone: str
    resume_url: str
    cover_letter: Optional[str] = None
    is_read: bool
    applied_at: datetime

    model_config = {"from_attributes": True}


class JobOpeningCreate(BaseModel):
    title: str
    department: str
    location: str
    job_type: str
    description: str
    responsibilities: str
    requirements: str
    is_open: bool = True


class JobOpeningUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    description: Optional[str] = None
    responsibilities: Optional[str] = None
    requirements: Optional[str] = None
    is_open: Optional[bool] = None


class JobOpeningResponse(BaseModel):
    id: UUID
    title: str
    department: str
    location: str
    job_type: str
    description: str
    responsibilities: str
    requirements: str
    is_open: bool
    created_at: datetime
    updated_at: datetime
    applications: List[JobApplicationResponse] = []

    model_config = {"from_attributes": True}


class JobOpeningToggle(BaseModel):
    is_open: bool
