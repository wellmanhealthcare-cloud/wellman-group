# Wellman Group — Current Sprint

**Sprint:** 8.1 — Schema Consistency Fix
**Duration:** 2026-06-04
**Status:** ⏳ IN PROGRESS

---

## Sprint 1: Project Setup ✅ COMPLETE

- PROJECT.md created as single source of truth
- Tech stack locked
- Folder structure defined
- Database schema designed (15 tables)
- API routes defined
- Development workflow established

---

## Sprint 2: Backend Foundation ✅ COMPLETE

- **core/config.py** — Pydantic Settings (DATABASE_URL, JWT, Cloudinary, CORS)
- **core/security.py** — bcrypt password hashing + JWT creation/verification
- **core/cors.py** — CORSMiddleware configuration
- **database.py** — SQLAlchemy engine, SessionLocal, Base, get_db()
- **dependencies.py** — get_db() + get_current_admin() with HTTPBearer
- **main.py** — FastAPI app init, CORS, GET /health
- **alembic.ini** — Alembic config with logging

---

## Sprint 3: SQLAlchemy Models ✅ COMPLETE

### Deliverables (11 files / 15 tables)
- ✅ admin_user.py — AdminUser
- ✅ hero_slide.py — HeroSlide
- ✅ service.py — Service + ServiceImage + ServiceFeature (1:M, cascade delete)
- ✅ project.py — Project + ProjectImage (1:M, FK→services, cascade delete)
- ✅ team.py — TeamMember
- ✅ client.py — Client
- ✅ testimonial.py — Testimonial
- ✅ job.py — JobOpening + JobApplication (1:M, cascade delete)
- ✅ certificate.py — Certificate
- ✅ inquiry.py — Inquiry
- ✅ site_settings.py — SiteSettings (single-row pattern)

### Architecture
- UUID primary keys (`default=uuid4`)
- `func.now()` for timestamps
- All relationships use `cascade="all, delete-orphan"`

---

## Sprint 4: PostgreSQL + Alembic ✅ COMPLETE

- ✅ alembic/env.py — Base imported, all 15 models registered, target_metadata set
- ✅ 001_initial_migration — creates all 15 tables, 5 FK indexes
- ✅ bc3d5d302a1d — nullability adjustments

### Known Issue (P2 — fix before production)
Migration bc3d5d302a1d drops 5 FK indexes. Restore by adding `index=True` to FK
columns in models and running `alembic revision --autogenerate -m "restore_fk_indexes"`.

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

### Architecture
- Pydantic v2 with `from_attributes=True`
- Three-tier pattern: Create / Update / Response
- Nested schemas for relationships

---

## Sprint 6: Authentication Service ✅ COMPLETE

- ✅ services/auth_service.py — JWT token creation/verification, bcrypt hashing, admin user lookup

---

## Sprint 7: Authentication Router ✅ COMPLETE

- ✅ routers/auth.py — POST /auth/login, GET /auth/me, PUT /auth/change-password, POST /auth/logout
- ✅ Registered in main.py with prefix `/v1`

---

## Sprint 8: Cloudinary Upload ✅ COMPLETE

- ✅ services/cloudinary_service.py — image upload, PDF upload, delete by public_id
- ✅ routers/upload.py — POST /admin/upload/image, POST /admin/upload/pdf, DELETE /admin/upload
- ✅ Registered in main.py with prefix `/v1`

---

## Sprint 8.1: Schema Consistency Fix ⏳ IN PROGRESS

**Trigger:** Audit found 4 model-schema nullability mismatches. Any GET endpoint that
serializes a row with NULL in these columns will return 500 Internal Server Error.
Must be fixed before Sprint 9 CRUD routers are added.

### Tasks (0/4 complete)

| # | File | Field | Current | Fix |
|---|------|-------|---------|-----|
| 1 | schemas/hero_slide.py | `subheading` | `str` (required) | `Optional[str] = None` |
| 2 | schemas/team.py | `bio` | `str` (required) | `Optional[str] = None` |
| 3 | schemas/team.py | `photo_url` | `str` (required) | `Optional[str] = None` |
| 4 | schemas/testimonial.py | `photo_url` | `str` (required) | `Optional[str] = None` |

### Scope
- Only modify: `schemas/hero_slide.py`, `schemas/team.py`, `schemas/testimonial.py`
- Do NOT touch models, routers, services, or any other file

---

## Sprint 9: Hero Slides CRUD (Blocked on Sprint 8.1)

### Deliverables
- routers/hero_slides.py
  - GET /hero-slides (public)
  - GET /admin/hero-slides
  - POST /admin/hero-slides
  - PUT /admin/hero-slides/{id}
  - DELETE /admin/hero-slides/{id}
  - PATCH /admin/hero-slides/{id}/reorder
  - GET /admin/hero-slides (list with order)

### Blocked On
Sprint 8.1 schema fixes must be applied first.

---

## Team
- **Lead Developer:** Claude (AI)
- **PM:** Prithvi Solanki
