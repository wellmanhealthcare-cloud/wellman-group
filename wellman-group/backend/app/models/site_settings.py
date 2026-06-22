from sqlalchemy import Column, String, Text, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database import Base


class SiteSettings(Base):
    __tablename__ = "site_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_name = Column(String, nullable=False)
    tagline = Column(String, nullable=True)
    unit_address = Column(Text, nullable=True)
    office_address = Column(Text, nullable=True)
    phone_primary = Column(String, nullable=False)
    phone_secondary = Column(String, nullable=True)
    email_primary = Column(String, nullable=False)
    email_secondary = Column(String, nullable=True)
    whatsapp_number = Column(String, nullable=False)
    instagram_url = Column(String, nullable=True)
    facebook_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    youtube_url = Column(String, nullable=True)
    google_maps_url = Column(Text, nullable=True)
    brochure_url = Column(String, nullable=True)
    footer_text = Column(Text, nullable=True)
    meta_title = Column(String, nullable=True)
    meta_desc = Column(Text, nullable=True)
    notification_channel = Column(String, nullable=False, server_default="whatsapp")
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
