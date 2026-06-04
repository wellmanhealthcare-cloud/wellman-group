from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional


class TeamMemberCreate(BaseModel):
    name: str
    designation: str
    bio: str
    photo_url: str
    linkedin_url: Optional[str] = None
    order_index: int = 0
    is_active: bool = True


class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    designation: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None


class TeamMemberResponse(BaseModel):
    id: UUID
    name: str
    designation: str
    bio: str
    photo_url: str
    linkedin_url: Optional[str] = None
    order_index: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
