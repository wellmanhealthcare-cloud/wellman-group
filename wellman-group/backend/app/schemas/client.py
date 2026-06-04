from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional


class ClientCreate(BaseModel):
    hospital_name: str
    city: str
    state: str
    logo_url: str
    order_index: int = 0
    is_active: bool = True


class ClientUpdate(BaseModel):
    hospital_name: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    logo_url: Optional[str] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None


class ClientResponse(BaseModel):
    id: UUID
    hospital_name: str
    city: str
    state: str
    logo_url: str
    order_index: int
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
