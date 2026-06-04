from datetime import datetime
from uuid import UUID
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class SiteSettingsUpdate(BaseModel):
    company_name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    tagline: Optional[str] = Field(default=None, max_length=300)
    unit_address: Optional[str] = None
    office_address: Optional[str] = None
    phone_primary: Optional[str] = Field(default=None, max_length=20)
    phone_secondary: Optional[str] = Field(default=None, max_length=20)
    email_primary: Optional[str] = Field(default=None, max_length=200)
    email_secondary: Optional[str] = Field(default=None, max_length=200)
    whatsapp_number: Optional[str] = Field(default=None, max_length=20)
    instagram_url: Optional[str] = Field(default=None, max_length=500)
    facebook_url: Optional[str] = Field(default=None, max_length=500)
    linkedin_url: Optional[str] = Field(default=None, max_length=500)
    youtube_url: Optional[str] = Field(default=None, max_length=500)
    google_maps_url: Optional[str] = None
    brochure_url: Optional[str] = None
    footer_text: Optional[str] = None
    meta_title: Optional[str] = Field(default=None, max_length=200)
    meta_desc: Optional[str] = Field(default=None, max_length=500)


class SiteSettingsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    company_name: str
    tagline: Optional[str] = None
    unit_address: Optional[str] = None
    office_address: Optional[str] = None
    phone_primary: Optional[str] = None
    phone_secondary: Optional[str] = None
    email_primary: Optional[str] = None
    email_secondary: Optional[str] = None
    whatsapp_number: Optional[str] = None
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    youtube_url: Optional[str] = None
    google_maps_url: Optional[str] = None
    brochure_url: Optional[str] = None
    footer_text: Optional[str] = None
    meta_title: Optional[str] = None
    meta_desc: Optional[str] = None
    updated_at: datetime


class BrochureUpload(BaseModel):
    file_url: str
