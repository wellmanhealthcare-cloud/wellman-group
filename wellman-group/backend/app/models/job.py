from sqlalchemy import Column, String, Text, Boolean, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database import Base


class JobOpening(Base):
    __tablename__ = "job_openings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    department = Column(String, nullable=False)
    location = Column(String, nullable=False)
    job_type = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    responsibilities = Column(Text, nullable=False)
    requirements = Column(Text, nullable=False)
    is_open = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    applications = relationship("JobApplication", back_populates="job_opening", cascade="all, delete-orphan")


class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("job_openings.id"), nullable=False)
    applicant_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    resume_url = Column(String, nullable=False)
    cover_letter = Column(Text, nullable=True)
    is_read = Column(Boolean, default=False)
    applied_at = Column(DateTime, server_default=func.now(), nullable=False)

    job_opening = relationship("JobOpening", back_populates="applications")
