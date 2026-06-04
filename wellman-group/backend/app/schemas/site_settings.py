from pydantic import BaseModel, HttpUrl
from datetime import datetime
from uuid import UUID
from typing import Optional, List


class SiteSettingsUpdate(BaseModel):
    company_name: Optional[str] = None
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


class SiteSettingsResponse(BaseModel):
    id: UUID
    company_name: str
    tagline: str
    unit_address: str
    office_address: str
    phone_primary: str
    phone_secondary: Optional[str] = None
    email_primary: str
    email_secondary: Optional[str] = None
    whatsapp_number: str
    instagram_url: Optional[str] = None
    facebook_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    youtube_url: Optional[str] = None
    google_maps_url: Optional[str] = None
    brochure_url: Optional[str] = None
    footer_text: Optional[str] = None
    meta_title: str
    meta_desc: str
    updated_at: datetime

    model_config = {"from_attributes": True}


class BrochureUpload(BaseModel):
    file_url: str
