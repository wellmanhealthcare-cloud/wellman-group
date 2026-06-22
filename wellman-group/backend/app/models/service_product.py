from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database import Base


class ServiceProduct(Base):
    __tablename__ = "service_products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    service_slug = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    order_index = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
