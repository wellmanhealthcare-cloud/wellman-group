from pydantic import BaseModel
from datetime import datetime, date
from uuid import UUID
from typing import Optional


class CertificateCreate(BaseModel):
    title: str
    issuing_body: str
    issue_date: date
    expiry_date: Optional[date] = None
    file_url: str
    order_index: int = 0
    is_active: bool = True


class CertificateUpdate(BaseModel):
    title: Optional[str] = None
    issuing_body: Optional[str] = None
    issue_date: Optional[date] = None
    expiry_date: Optional[date] = None
    file_url: Optional[str] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None


class CertificateResponse(BaseModel):
    id: UUID
    title: str
    issuing_body: str
    issue_date: date
    expiry_date: Optional[date] = None
    file_url: str
    order_index: int
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
