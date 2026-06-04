from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database import Base


class Service(Base):
    __tablename__ = "services"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    short_desc = Column(Text, nullable=False)
    long_desc = Column(Text, nullable=False)
    icon_url = Column(String, nullable=True)
    order_index = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    meta_title = Column(String, nullable=True)
    meta_desc = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    images = relationship("ServiceImage", back_populates="service", cascade="all, delete-orphan")
    features = relationship("ServiceFeature", back_populates="service", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="service")


class ServiceImage(Base):
    __tablename__ = "service_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"), nullable=False)
    image_url = Column(String, nullable=False)
    caption = Column(String, nullable=True)
    order_index = Column(Integer, default=0)

    service = relationship("Service", back_populates="images")


class ServiceFeature(Base):
    __tablename__ = "service_features"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"), nullable=False)
    feature_text = Column(String, nullable=False)
    order_index = Column(Integer, default=0)

    service = relationship("Service", back_populates="features")
