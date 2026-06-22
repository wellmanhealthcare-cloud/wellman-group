from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ServiceProductBase(BaseModel):
    service_slug: str = Field(min_length=1, max_length=100)
    name: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    image_url: Optional[str] = None
    order_index: int = Field(default=0, ge=0)
    is_active: bool = True


class ServiceProductCreate(ServiceProductBase):
    pass


class ServiceProductUpdate(BaseModel):
    service_slug: Optional[str] = Field(default=None, min_length=1, max_length=100)
    name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = None
    image_url: Optional[str] = None
    order_index: Optional[int] = Field(default=None, ge=0)
    is_active: Optional[bool] = None


class ServiceProductResponse(ServiceProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
