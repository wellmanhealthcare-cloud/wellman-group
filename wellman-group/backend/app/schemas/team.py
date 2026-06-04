from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ReorderItem(BaseModel):
    id: UUID
    order_index: int = Field(ge=0)


class TeamMemberBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    designation: str = Field(min_length=1, max_length=150)
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = Field(default=None, max_length=500)
    order_index: int = Field(default=0, ge=0)
    is_active: bool = True


class TeamMemberCreate(TeamMemberBase):
    pass


class TeamMemberUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    designation: Optional[str] = Field(default=None, min_length=1, max_length=150)
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = Field(default=None, max_length=500)
    order_index: Optional[int] = Field(default=None, ge=0)
    is_active: Optional[bool] = None


class TeamMemberResponse(TeamMemberBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime


class TeamReorder(BaseModel):
    items: list[ReorderItem]
