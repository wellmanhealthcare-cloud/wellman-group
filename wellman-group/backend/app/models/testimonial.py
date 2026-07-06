from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database import Base


class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    client_name = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    hospital_name = Column(String, nullable=True)
    message = Column(Text, nullable=True)
    photo_url = Column(String, nullable=True)
    rating = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
