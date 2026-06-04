# Wellman Group — Changelog

## [0.1.0] — 2026-06-04

### Sprint 2: Backend Foundation ✅
- **core/config.py** — Pydantic Settings with environment variables (DATABASE_URL, JWT_SECRET, Cloudinary credentials)
- **core/security.py** — Password hashing (bcrypt) + JWT token creation/verification
- **core/cors.py** — CORS middleware configuration for frontend origin
- **database.py** — SQLAlchemy 2.0 engine, SessionLocal, declarative Base, get_db() dependency
- **dependencies.py** — Dependency injection: get_db() and get_current_admin() with HTTPBearer token validation
- **main.py** — FastAPI application initialization with CORS setup and GET /health endpoint
- **alembic.ini** — Production-ready Alembic configuration with [alembic] section, logging, SQLAlchemy URL

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

### Key Architecture Decisions
- **Pydantic v2:** `model_config = {"from_attributes": True}` for ORM compatibility
- **UUID Types:** All IDs use UUID for PRIMARY KEYS
- **Schema Patterns:** Separate Create/Update/Response schemas for flexibility
- **Nested Relationships:** Schemas include related data (e.g., Service includes Images + Features)
- **Validation:** EmailStr for emails, int range for ratings, date types for certificates

---

## [0.0.1] — 2026-06-04

### Initial Setup
- Created PROJECT.md as single source of truth
- Defined tech stack (locked)
- Created folder structure spec
- Created database schema (15 tables)
- Defined API routes (23 endpoints)
- Established development workflow
