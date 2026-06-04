from datetime import datetime, date
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ReorderItem(BaseModel):
    id: UUID
    order_index: int = Field(ge=0)


class CertificateBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    issuing_body: str = Field(min_length=1, max_length=200)
    issue_date: date
    expiry_date: Optional[date] = None
    file_url: str
    order_index: int = Field(default=0, ge=0)
    is_active: bool = True


class CertificateCreate(CertificateBase):
    pass


class CertificateUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    issuing_body: Optional[str] = Field(default=None, min_length=1, max_length=200)
    issue_date: Optional[date] = None
    expiry_date: Optional[date] = None
    file_url: Optional[str] = None
    order_index: Optional[int] = Field(default=None, ge=0)
    is_active: Optional[bool] = None


class CertificateResponse(CertificateBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime


class CertificateReorder(BaseModel):
    items: list[ReorderItem]
