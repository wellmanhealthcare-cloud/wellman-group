from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional


class HeroSlideCreate(BaseModel):
    image_url: str
    heading: str
    subheading: str
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    order_index: int = 0
    is_active: bool = True


class HeroSlideUpdate(BaseModel):
    image_url: Optional[str] = None
    heading: Optional[str] = None
    subheading: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None


class HeroSlideResponse(BaseModel):
    id: UUID
    image_url: str
    heading: str
    subheading: str
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    order_index: int
    is_active: bool

    model_config = {"from_attributes": True}


class HeroSlideReorder(BaseModel):
    items: list[dict]  # [{"id": UUID, "order_index": int}, ...]
