from pydantic import BaseModel
from datetime import datetime, date
from uuid import UUID
from typing import Optional, List


class ProjectImageCreate(BaseModel):
    image_url: str
    caption: Optional[str] = None
    order_index: int = 0


class ProjectImageUpdate(BaseModel):
    image_url: Optional[str] = None
    caption: Optional[str] = None
    order_index: Optional[int] = None


class ProjectImageResponse(BaseModel):
    id: UUID
    image_url: str
    caption: Optional[str] = None
    order_index: int

    model_config = {"from_attributes": True}


class ProjectCreate(BaseModel):
    title: str
    slug: str
    client_name: str
    city: str
    state: str
    service_id: UUID
    description: str
    completion_date: date
    is_featured: bool = False
    is_active: bool = True
    order_index: int = 0
    meta_title: Optional[str] = None
    meta_desc: Optional[str] = None


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    client_name: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    service_id: Optional[UUID] = None
    description: Optional[str] = None
    completion_date: Optional[date] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    order_index: Optional[int] = None
    meta_title: Optional[str] = None
    meta_desc: Optional[str] = None


class ProjectResponse(BaseModel):
    id: UUID
    title: str
    slug: str
    client_name: str
    city: str
    state: str
    service_id: UUID
    description: str
    completion_date: date
    is_featured: bool
    is_active: bool
    order_index: int
    meta_title: Optional[str] = None
    meta_desc: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    images: List[ProjectImageResponse] = []

    model_config = {"from_attributes": True}


class ProjectFeatureToggle(BaseModel):
    is_featured: bool
