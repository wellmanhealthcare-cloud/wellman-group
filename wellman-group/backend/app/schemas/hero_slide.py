from uuid import UUID
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ReorderItem(BaseModel):
    id: UUID
    order_index: int = Field(ge=0)


class HeroSlideBase(BaseModel):
    image_url: str
    heading: str = Field(min_length=1, max_length=200)
    subheading: Optional[str] = Field(default=None, max_length=500)
    cta_text: Optional[str] = Field(default=None, max_length=100)
    cta_link: Optional[str] = Field(default=None, max_length=500)
    order_index: int = Field(default=0, ge=0)
    is_active: bool = True


class HeroSlideCreate(HeroSlideBase):
    pass


class HeroSlideUpdate(BaseModel):
    image_url: Optional[str] = None
    heading: Optional[str] = Field(default=None, min_length=1, max_length=200)
    subheading: Optional[str] = Field(default=None, min_length=1, max_length=500)
    cta_text: Optional[str] = Field(default=None, max_length=100)
    cta_link: Optional[str] = Field(default=None, max_length=500)
    order_index: Optional[int] = Field(default=None, ge=0)
    is_active: Optional[bool] = None


class HeroSlideResponse(HeroSlideBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID


class HeroSlideReorder(BaseModel):
    items: list[ReorderItem]
