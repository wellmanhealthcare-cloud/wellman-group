from sqlalchemy import Column, String, Integer, Boolean, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database import Base


class HeroSlide(Base):
    __tablename__ = "hero_slides"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    image_url = Column(String, nullable=True)
    heading = Column(String, nullable=True)
    subheading = Column(String, nullable=True)
    cta_text = Column(String, nullable=True)
    cta_link = Column(String, nullable=True)
    order_index = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
