# Wellman Group — Changelog

## [0.7.0] — 2026-06-04

### Sprint 8.1: Schema Consistency Fix ⏳ IN PROGRESS
- 4 nullability mismatches identified by audit
- Fix pending: `schemas/hero_slide.py`, `schemas/team.py`, `schemas/testimonial.py`

---

## [0.6.0] — 2026-06-04

### Sprint 8: Cloudinary Upload Service ✅
- **services/cloudinary_service.py** — Image upload (to `wellman/images/`), PDF upload (to `wellman/pdfs/`), delete by public_id
- **routers/upload.py** — POST /admin/upload/image, POST /admin/upload/pdf, DELETE /admin/upload
- Upload router registered in main.py with `/v1` prefix

---

## [0.5.0] — 2026-06-04

### Sprint 7: Authentication Router ✅
- **routers/auth.py** — POST /auth/login, GET /auth/me, PUT /auth/change-password, POST /auth/logout
- All routes registered in main.py with prefix `/v1`
- Admin-only routes protected via `get_current_admin` dependency

---

## [0.4.0] — 2026-06-04

### Sprint 6: Authentication Service ✅
- **services/auth_service.py** — JWT token creation/verification (PyJWT), bcrypt password hashing (passlib), admin user lookup by email

---

## [0.3.0] — 2026-06-04

### Sprint 4: PostgreSQL + Alembic ✅
- **alembic/env.py** — Configured for SQLAlchemy 2.0: imports Base from app.database, imports all 15 models to register with Base.metadata, reads DATABASE_URL from pydantic settings
- **001_initial_migration** — Creates all 15 tables in correct FK dependency order, 5 FK indexes
- **bc3d5d302a1d** — Adjusts nullable constraints (note: drops 5 FK indexes — restore before production)

---

## [0.2.0] — 2026-06-04

### Sprint 3: SQLAlchemy Models ✅
Created 11 model files covering all 15 database tables:
- **admin_user.py** — AdminUser
- **hero_slide.py** — HeroSlide
- **service.py** — Service + ServiceImage + ServiceFeature (1:M, cascade delete)
- **project.py** — Project + ProjectImage (1:M, FK→services, cascade delete)
- **team.py** — TeamMember (bio, photo_url nullable)
- **client.py** — Client
- **testimonial.py** — Testimonial (photo_url nullable, rating 1-5)
- **job.py** — JobOpening + JobApplication (1:M, cascade delete)
- **certificate.py** — Certificate (expiry_date nullable)
- **inquiry.py** — Inquiry (company_name nullable)
- **site_settings.py** — SiteSettings (single-row, fixed UUID pattern)

### Key Architecture
- UUID primary keys with `default=uuid4`
- Timestamps use `datetime.utcnow`
- All 1:M relationships use `cascade="all, delete-orphan"`

---

## [0.1.0] — 2026-06-04

### Sprint 5: Pydantic Schemas ✅
Created 12 schema files with Pydantic v2 ORM compatibility:
- **auth.py** — LoginRequest, TokenResponse, AdminUserResponse, AdminUserCreate/Update, ChangePasswordRequest
- **hero_slide.py** — HeroSlideCreate/Update/Response/Reorder with order_index and is_active
- **service.py** — Service + nested ServiceImages + ServiceFeatures (relationships preserved)
- **project.py** — Project + nested ProjectImages with FeatureToggle for is_featured flag
- **team.py** — TeamMember CRUD schemas with order_index
- **client.py** — Client CRUD schemas with city/state
- **testimonial.py** — Testimonial CRUD with rating (1-5)
- **job.py** — JobOpening + JobApplication schemas with toggle support
- **certificate.py** — Certificate CRUD with issue_date and expiry_date
- **inquiry.py** — Inquiry creation and response with is_read flag
- **site_settings.py** — SiteSettings update/response + BrochureUpload schema
- **dashboard.py** — DashboardStats and DashboardResponse for admin metrics

### Sprint 2: Backend Foundation ✅
- **core/config.py** — Pydantic Settings with environment variables (DATABASE_URL, JWT_SECRET, Cloudinary credentials)
- **core/security.py** — Password hashing (bcrypt) + JWT token creation/verification
- **core/cors.py** — CORS middleware configuration for frontend origin
- **database.py** — SQLAlchemy 2.0 engine, SessionLocal, declarative Base, get_db() dependency
- **dependencies.py** — Dependency injection: get_db() and get_current_admin() with HTTPBearer token validation
- **main.py** — FastAPI application initialization with CORS setup and GET /health endpoint
- **alembic.ini** — Production-ready Alembic configuration

### Key Architecture Decisions
- **Pydantic v2:** `model_config = {"from_attributes": True}` for ORM compatibility
- **UUID Types:** All IDs use UUID for PRIMARY KEYS
- **Schema Patterns:** Separate Create/Update/Response schemas for flexibility
- **Nested Relationships:** Schemas include related data (e.g., Service includes Images + Features)
- **Validation:** EmailStr for emails, int range for ratings, date types for certificates

---

## [0.0.1] — 2026-06-04

### Sprint 1: Initial Setup
- Created PROJECT.md as single source of truth
- Defined tech stack (locked)
- Created folder structure spec
- Created database schema (15 tables)
- Defined API routes (83 endpoints across 14 routers)
- Established development workflow (ChatGPT plan → Claude generate → review → commit)
