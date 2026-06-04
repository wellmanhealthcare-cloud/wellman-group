from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ReorderItem(BaseModel):
    id: UUID
    order_index: int = Field(ge=0)


class TestimonialBase(BaseModel):
    client_name: str = Field(min_length=1, max_length=100)
    designation: str = Field(min_length=1, max_length=150)
    hospital_name: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=1)
    photo_url: Optional[str] = None
    rating: int = Field(ge=1, le=5)
    order_index: int = Field(default=0, ge=0)
    is_active: bool = True


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):
    client_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    designation: Optional[str] = Field(default=None, min_length=1, max_length=150)
    hospital_name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    message: Optional[str] = Field(default=None, min_length=1)
    photo_url: Optional[str] = None
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    order_index: Optional[int] = Field(default=None, ge=0)
    is_active: Optional[bool] = None


class TestimonialResponse(TestimonialBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime


class TestimonialReorder(BaseModel):
    items: list[ReorderItem]
