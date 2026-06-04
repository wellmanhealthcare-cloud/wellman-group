from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ReorderItem(BaseModel):
    id: UUID
    order_index: int = Field(ge=0)


# ── Service Image ─────────────────────────────────────────────────────────────

class ServiceImageBase(BaseModel):
    image_url: str
    caption: Optional[str] = Field(default=None, max_length=300)
    order_index: int = Field(default=0, ge=0)


class ServiceImageCreate(ServiceImageBase):
    pass


class ServiceImageUpdate(BaseModel):
    image_url: Optional[str] = None
    caption: Optional[str] = Field(default=None, max_length=300)
    order_index: Optional[int] = Field(default=None, ge=0)


class ServiceImageResponse(ServiceImageBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID


# ── Service Feature ───────────────────────────────────────────────────────────

class ServiceFeatureBase(BaseModel):
    feature_text: str = Field(min_length=1, max_length=500)
    order_index: int = Field(default=0, ge=0)


class ServiceFeatureCreate(ServiceFeatureBase):
    pass


class ServiceFeatureUpdate(BaseModel):
    feature_text: Optional[str] = Field(default=None, min_length=1, max_length=500)
    order_index: Optional[int] = Field(default=None, ge=0)


class ServiceFeatureResponse(ServiceFeatureBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID


# ── Service ───────────────────────────────────────────────────────────────────

class ServiceBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    slug: str = Field(min_length=1, max_length=200, pattern=r"^[a-z0-9-]+$")
    short_desc: str = Field(min_length=1, max_length=500)
    long_desc: str
    icon_url: str
    order_index: int = Field(default=0, ge=0)
    is_active: bool = True
    meta_title: Optional[str] = Field(default=None, max_length=200)
    meta_desc: Optional[str] = Field(default=None, max_length=500)


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    slug: Optional[str] = Field(default=None, min_length=1, max_length=200, pattern=r"^[a-z0-9-]+$")
    short_desc: Optional[str] = Field(default=None, min_length=1, max_length=500)
    long_desc: Optional[str] = None
    icon_url: Optional[str] = None
    order_index: Optional[int] = Field(default=None, ge=0)
    is_active: Optional[bool] = None
    meta_title: Optional[str] = Field(default=None, max_length=200)
    meta_desc: Optional[str] = Field(default=None, max_length=500)


class ServiceListResponse(BaseModel):
    """Lightweight response for list endpoints — images and features excluded."""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    slug: str
    short_desc: str
    icon_url: str
    order_index: int
    is_active: bool
    meta_title: Optional[str] = None
    meta_desc: Optional[str] = None


class ServiceResponse(ServiceBase):
    """Full response with nested images and features — for detail endpoints."""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime
    images: list[ServiceImageResponse] = []
    features: list[ServiceFeatureResponse] = []


class ServiceReorder(BaseModel):
    items: list[ReorderItem]


class ServiceImageReorder(BaseModel):
    items: list[ReorderItem]


class ServiceFeatureReorder(BaseModel):
    items: list[ReorderItem]
