# Wellman Group — Current Sprint

**Sprint:** 5+6 Backend Models  
**Duration:** 2026-06-04 → 2026-06-11  
**Status:** 50% Complete (Schemas done, Models pending)

---

## Sprint 5: Pydantic Schemas ✅ COMPLETE

### Deliverables (12/12)
- ✅ auth.py — Login/Token/User schemas
- ✅ hero_slide.py — CRUD + Reorder
- ✅ service.py — Service + Images + Features (nested)
- ✅ project.py — Project + Images + Toggle
- ✅ team.py — Team member CRUD
- ✅ client.py — Client CRUD
- ✅ testimonial.py — Testimonial with rating
- ✅ job.py — Job + Applications
- ✅ certificate.py — Certificate with dates
- ✅ inquiry.py — Inquiry + MarkRead
- ✅ site_settings.py — Settings + Brochure upload
- ✅ dashboard.py — Dashboard stats

### Architecture Highlights
- **Pydantic v2** with `from_attributes=True` for ORM compatibility
- **Nested schemas** for relationships (Service includes Images/Features)
- **Validation:** EmailStr, rating (1-5), optional dates
- **Three-tier pattern:** Create, Update, Response schemas

---

## Sprint 6: SQLAlchemy Models ⏳ IN PROGRESS

### Required Files (11 total)

```python
# All models inherit from Base (from app.database)
# All PKs are UUID (auto-generated with uuid4())
# All timestamps use func.now()
```

#### Table Definitions

**admin_users** — Single admin user
```python
id: UUID [PK]
name: str
email: str [UNIQUE]
password_hash: str
is_active: bool
created_at: datetime
last_login: datetime [NULL]
```

**hero_slides** — Homepage hero carousel
```python
id: UUID [PK]
image_url: str
heading: str
subheading: str
cta_text: str [NULL]
cta_link: str [NULL]
order_index: int
is_active: bool
```

**services** + service_images + service_features
```python
Service:
  id: UUID [PK]
  title, slug [UNIQUE], short_desc, long_desc, icon_url
  order_index, is_active
  meta_title, meta_desc
  created_at, updated_at
  └─ images: List[ServiceImage] (1:M cascade delete)
  └─ features: List[ServiceFeature] (1:M cascade delete)

ServiceImage:
  id: UUID [PK]
  service_id: UUID [FK→services]
  image_url, caption, order_index

ServiceFeature:
  id: UUID [PK]
  service_id: UUID [FK→services]
  feature_text, order_index
```

**projects** + project_images
```python
Project:
  id: UUID [PK]
  title, slug [UNIQUE], client_name, city, state
  service_id: UUID [FK→services]
  description, completion_date
  is_featured, is_active, order_index
  meta_title, meta_desc
  created_at, updated_at
  └─ images: List[ProjectImage] (1:M cascade delete)

ProjectImage:
  id: UUID [PK]
  project_id: UUID [FK→projects]
  image_url, caption, order_index
```

**team_members**
```python
id: UUID [PK]
name, designation, bio
photo_url, linkedin_url [NULL]
order_index, is_active
created_at, updated_at
```

**clients** (hospital logos)
```python
id: UUID [PK]
hospital_name, city, state
logo_url
order_index, is_active
created_at
```

**testimonials** (reviews)
```python
id: UUID [PK]
client_name, designation, hospital_name
message, photo_url
rating: int (1-5)
is_active, order_index
created_at
```

**job_openings** + job_applications
```python
JobOpening:
  id: UUID [PK]
  title, department, location, job_type
  description, responsibilities, requirements
  is_open, created_at, updated_at
  └─ applications: List[JobApplication] (1:M cascade delete)

JobApplication:
  id: UUID [PK]
  job_id: UUID [FK→job_openings]
  applicant_name, email, phone
  resume_url, cover_letter [NULL]
  is_read, applied_at
```

**certificates**
```python
id: UUID [PK]
title, issuing_body
issue_date, expiry_date [NULL]
file_url
order_index, is_active
created_at
```

**inquiries** (contact form submissions)
```python
id: UUID [PK]
full_name, company_name [NULL]
email, phone, subject, message
is_read, created_at
```

**site_settings** (global config — single row)
```python
id: UUID [PK] (always == some fixed UUID)
company_name, tagline
unit_address, office_address
phone_primary, phone_secondary [NULL]
email_primary, email_secondary [NULL]
whatsapp_number
instagram_url, facebook_url, linkedin_url, youtube_url [NULL]
google_maps_url, brochure_url [NULL]
footer_text
meta_title, meta_desc
updated_at
```

### Implementation Pattern

```python
# app/models/service.py
from uuid import uuid4
from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.database import Base

class Service(Base):
    __tablename__ = "services"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    short_desc = Column(String, nullable=False)
    long_desc = Column(Text, nullable=False)
    icon_url = Column(String, nullable=False)
    order_index = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    meta_title = Column(String, nullable=True)
    meta_desc = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    images = relationship("ServiceImage", back_populates="service", cascade="all, delete-orphan")
    features = relationship("ServiceFeature", back_populates="service", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Service {self.title}>"

class ServiceImage(Base):
    __tablename__ = "service_images"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"), nullable=False)
    image_url = Column(String, nullable=False)
    caption = Column(String, nullable=True)
    order_index = Column(Integer, default=0)
    
    service = relationship("Service", back_populates="images")
    
    def __repr__(self):
        return f"<ServiceImage {self.service_id}>"
```

### Dependencies
- Sprint 5 Schemas ✅ (already done)
- app/database.py ✅ (Base already exists)
- PostgreSQL connection string (in .env)

### Next Commands
```bash
# After all 11 models created in app/models/:
cd backend

# Create initial migration
alembic revision --autogenerate -m "initial migration: create all tables"

# Review generated migration file in alembic/versions/

# Apply migration
alembic upgrade head

# Verify tables in PostgreSQL
psql $DATABASE_URL -c "\dt"
```

---

## Sprint 7: Alembic Migrations (Blocked on Sprint 6)

### Tasks
- [ ] Update alembic/env.py
  - Import Base from app.database
  - Import all models (registers them with Base)
  - Set target_metadata = Base.metadata
- [ ] Generate initial migration
  - `alembic revision --autogenerate -m "initial migration"`
- [ ] Test migration
  - `alembic upgrade head`

### Blocker
**WAIT FOR:** Sprint 6 models to be created first

---

## Sprint 8: API Routers (Week 2)

### 14 routers × 6 endpoints avg = 83 endpoints
- auth (5)
- hero_slides (7)
- services (13)
- projects (11)
- team (5)
- clients (5)
- testimonials (5)
- jobs (11)
- certificates (5)
- inquiries (4)
- settings (3)
- upload (3)
- chatbot (1)
- dashboard (1)

### Blocked On
Sprint 6 models ✅  
Sprint 7 migrations ✅

---

## Team
- **Lead Developer:** Claude (AI)
- **PM:** Prithvi Solanki
