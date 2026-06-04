from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional, List


class ServiceFeatureCreate(BaseModel):
    feature_text: str
    order_index: int = 0


class ServiceFeatureUpdate(BaseModel):
    feature_text: Optional[str] = None
    order_index: Optional[int] = None


class ServiceFeatureResponse(BaseModel):
    id: UUID
    feature_text: str
    order_index: int

    model_config = {"from_attributes": True}


class ServiceImageCreate(BaseModel):
    image_url: str
    caption: Optional[str] = None
    order_index: int = 0


class ServiceImageUpdate(BaseModel):
    image_url: Optional[str] = None
    caption: Optional[str] = None
    order_index: Optional[int] = None


class ServiceImageResponse(BaseModel):
    id: UUID
    image_url: str
    caption: Optional[str] = None
    order_index: int

    model_config = {"from_attributes": True}


class ServiceCreate(BaseModel):
    title: str
    slug: str
    short_desc: str
    long_desc: str
    icon_url: str
    order_index: int = 0
    is_active: bool = True
    meta_title: Optional[str] = None
    meta_desc: Optional[str] = None


class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    short_desc: Optional[str] = None
    long_desc: Optional[str] = None
    icon_url: Optional[str] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None
    meta_title: Optional[str] = None
    meta_desc: Optional[str] = None


class ServiceResponse(BaseModel):
    id: UUID
    title: str
    slug: str
    short_desc: str
    long_desc: str
    icon_url: str
    order_index: int
    is_active: bool
    meta_title: Optional[str] = None
    meta_desc: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    images: List[ServiceImageResponse] = []
    features: List[ServiceFeatureResponse] = []

    model_config = {"from_attributes": True}
