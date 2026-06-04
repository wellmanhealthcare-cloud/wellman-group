from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional


class TestimonialCreate(BaseModel):
    client_name: str
    designation: str
    hospital_name: str
    message: str
    photo_url: str
    rating: int  # 1-5
    order_index: int = 0
    is_active: bool = True


class TestimonialUpdate(BaseModel):
    client_name: Optional[str] = None
    designation: Optional[str] = None
    hospital_name: Optional[str] = None
    message: Optional[str] = None
    photo_url: Optional[str] = None
    rating: Optional[int] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None


class TestimonialResponse(BaseModel):
    id: UUID
    client_name: str
    designation: str
    hospital_name: str
    message: str
    photo_url: str
    rating: int
    order_index: int
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
