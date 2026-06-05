from datetime import datetime, date
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ReorderItem(BaseModel):
    id: UUID
    order_index: int = Field(ge=0)


# ── Project Image ─────────────────────────────────────────────────────────────

class ProjectImageBase(BaseModel):
    image_url: str
    caption: Optional[str] = Field(default=None, max_length=300)
    order_index: int = Field(default=0, ge=0)


class ProjectImageCreate(ProjectImageBase):
    pass


class ProjectImageUpdate(BaseModel):
    image_url: Optional[str] = None
    caption: Optional[str] = Field(default=None, max_length=300)
    order_index: Optional[int] = Field(default=None, ge=0)


class ProjectImageResponse(ProjectImageBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID


# ── Project ───────────────────────────────────────────────────────────────────

class ProjectBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    slug: str = Field(min_length=1, max_length=200, pattern=r"^[a-z0-9-]+$")
    client_name: str = Field(min_length=1, max_length=200)
    city: str = Field(min_length=1, max_length=100)
    state: str = Field(min_length=1, max_length=100)
    service_id: UUID
    description: str
    completion_date: date
    is_featured: bool = False
    is_active: bool = True
    order_index: int = Field(default=0, ge=0)
    meta_title: Optional[str] = Field(default=None, max_length=200)
    meta_desc: Optional[str] = Field(default=None, max_length=500)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    slug: Optional[str] = Field(default=None, min_length=1, max_length=200, pattern=r"^[a-z0-9-]+$")
    client_name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    city: Optional[str] = Field(default=None, min_length=1, max_length=100)
    state: Optional[str] = Field(default=None, min_length=1, max_length=100)
    service_id: Optional[UUID] = None
    description: Optional[str] = None
    completion_date: Optional[date] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    order_index: Optional[int] = Field(default=None, ge=0)
    meta_title: Optional[str] = Field(default=None, max_length=200)
    meta_desc: Optional[str] = Field(default=None, max_length=500)


class ProjectListResponse(BaseModel):
    """Lightweight response for list endpoints — first image included as cover."""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    slug: str
    client_name: str
    city: str
    state: str
    service_id: UUID
    completion_date: date
    is_featured: bool
    is_active: bool
    order_index: int
    meta_title: Optional[str] = None
    meta_desc: Optional[str] = None
    cover_image_url: Optional[str] = None


class ProjectResponse(ProjectBase):
    """Full response with nested images — for detail endpoints."""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime
    images: list[ProjectImageResponse] = []


class ProjectFeatureToggle(BaseModel):
    is_featured: bool


class ProjectReorder(BaseModel):
    items: list[ReorderItem]


class ProjectImageReorder(BaseModel):
    items: list[ReorderItem]
