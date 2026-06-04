# SESSION_HANDOFF.md
Wellman Group — Backend Development
Last Updated: 2026-06-04
Handoff After: Sprint 8 (Cloudinary Upload Service)

---

## How to Use This Document

Paste this file at the start of a new session and say:
> "This is my SESSION_HANDOFF.md. Continue from Sprint 9."

The AI will have complete context. No prior chat history required.

---

## 1. Project Overview

**Client:** Wellman Group
**Project type:** Complete website rebuild — public site + custom admin panel
**Current live site:** wellmangroup.in (PHP + jQuery on Hostinger, untouched)
**Goal:** Replace with a modern stack. New site deploys to VPS; DNS flips when ready.

**Company context (for chatbot/content work):**
- Medical infrastructure company, Ahmedabad, India
- 12+ years experience, 185+ hospital clients, 45+ cities
- Services: Modular OT, Medical Gas Pipeline, HVAC/Cleanroom, Clean Room,
  Laminar Air Flow, Modular ICU, Modular NICU, IVF Lab Setup
- Phone/WhatsApp: +91 94094 28888 | Email: info@wellmangroup.in

**Development workflow:**
- Planning/review: ChatGPT (Product Owner / Architect)
- Code generation: Claude Code (this tool)
- Version control: GitHub (private repo)
- Sprints: one at a time, no cross-sprint file modifications

---

## 2. Current Architecture

### Stack (locked — do not change)

| Layer | Technology | Version |
|---|---|---|
| Frontend | Next.js (App Router) | 16.2.7 |
| Frontend styling | Tailwind CSS | v4 |
| Frontend UI | shadcn/ui | not yet installed |
| Frontend HTTP | Axios | not yet installed |
| Backend | FastAPI | 0.104.1 |
| ORM | SQLAlchemy | 2.0.23 |
| Migrations | Alembic | 1.12.1 |
| Database | PostgreSQL | local dev |
| File storage | Cloudinary | 1.36.0 |
| Auth | JWT (PyJWT) | 2.8.1 |
| Chatbot | Custom RAG proxy (not yet connected) | — |
| Hosting target | Hostinger VPS | — |
| Web server | Nginx | — |
| Process manager | PM2 (Next.js) + Uvicorn (FastAPI) | — |

⚠️ **Next.js version note:** The frontend uses Next.js 16.2.7 — a version released
after common AI training cutoffs. The AGENTS.md file in frontend/ warns that APIs,
conventions, and file structure may differ from older Next.js knowledge. Always
read `node_modules/next/dist/docs/` before writing frontend code.

### Repository Layout

```
wellman-group/
├── backend/
│   ├── app/
│   │   ├── main.py              ← FastAPI app entry point
│   │   ├── database.py          ← SQLAlchemy engine + Base + SessionLocal
│   │   ├── dependencies.py      ← get_db(), get_current_admin()
│   │   ├── core/
│   │   │   ├── config.py        ← Pydantic Settings (reads .env)
│   │   │   ├── security.py      ← bcrypt + JWT helpers
│   │   │   └── cors.py          ← CORSMiddleware setup
│   │   ├── models/              ← SQLAlchemy ORM (15 models, all done)
│   │   ├── schemas/             ← Pydantic v2 (13 files, all done)
│   │   ├── routers/             ← auth.py + upload.py done; CRUD pending
│   │   └── services/            ← auth_service.py + cloudinary_service.py done
│   ├── alembic/                 ← migrations (2 files, head applied)
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env                     ← exists; some values are placeholders
└── frontend/
    ├── app/
    │   ├── layout.tsx           ← root layout (scaffolded only)
    │   └── page.tsx             ← home page stub
    ├── package.json
    └── AGENTS.md                ← Next.js version warning
```

### API Base URL

`api.wellmangroup.in/v1` (production)
`http://localhost:8000/v1` (local dev)

---

## 3. Completed Sprints

### Sprint 1 — Project Initialization
Created the monorepo folder structure.

### Sprint 2 — Backend Foundation
Files created/finalised:

| File | Purpose |
|---|---|
| `app/core/config.py` | Pydantic `Settings` class; reads `.env`; all env vars defined |
| `app/core/security.py` | `hash_password`, `verify_password`, `create_access_token`, `decode_token` |
| `app/core/cors.py` | `setup_cors(app)` — applies CORSMiddleware |
| `app/database.py` | `engine`, `SessionLocal`, `Base(DeclarativeBase)` |
| `app/dependencies.py` | `get_db()`, `get_current_admin()` |
| `app/main.py` | FastAPI app with lifespan, health endpoints, router registration |

Key decisions baked in:
- `DeclarativeBase` (SQLAlchemy 2.0 style, not legacy `declarative_base()`)
- `expire_on_commit=False` on SessionLocal
- `pool_size=10`, `max_overflow=20`, `pool_timeout=30`
- `DEBUG` flag controls SQL echo
- `HTTPBearer(auto_error=False)` — raises 401, not 403, on missing token
- `create_access_token` accepts `extra_claims: dict | None` for JWT payload extension

### Sprint 3 — SQLAlchemy Models

All 15 ORM models in `app/models/`:

| File | Classes |
|---|---|
| admin_user.py | `AdminUser` |
| hero_slide.py | `HeroSlide` |
| service.py | `Service`, `ServiceImage`, `ServiceFeature` |
| project.py | `Project`, `ProjectImage` |
| team.py | `TeamMember` |
| client.py | `Client` |
| testimonial.py | `Testimonial` |
| job.py | `JobOpening`, `JobApplication` |
| certificate.py | `Certificate` |
| inquiry.py | `Inquiry` |
| site_settings.py | `SiteSettings` |

`app/models/__init__.py` imports and exports all 15 classes.
Alembic `env.py` imports all models to register them with `Base.metadata`.

### Sprint 4 — PostgreSQL + Alembic

**Database:** `wellman_db` on `localhost:5432`, user `postgres`
**Connection string in `.env`:** `postgresql://postgres:Kar%402005@localhost:5432/wellman_db`

**Migrations (2 files in `alembic/versions/`):**

| Revision | Description |
|---|---|
| `001_initial_migration` | Creates all 15 tables + 5 FK indexes |
| `bc3d5d302a1d` | Adjusts column nullability; drops the 5 FK indexes (see Known Issues) |

Migration chain: `None → 001_initial_migration → bc3d5d302a1d`
Head: `bc3d5d302a1d`

**Alembic commands:**
```bash
cd backend
alembic upgrade head        # apply all migrations
alembic current             # show current revision
alembic history             # show migration chain
alembic downgrade -1        # roll back one step
```

### Sprint 5 — Pydantic Schemas

All 13 schema files in `app/schemas/`. Pattern used throughout:
- `XBase` — shared validated fields (parent of Create + Response)
- `XCreate(XBase)` — POST body
- `XUpdate(BaseModel)` — all Optional, for PUT/PATCH
- `XResponse(XBase)` — adds `id`, timestamps, nested children; `ConfigDict(from_attributes=True)`

Special schemas:
- `ServiceListResponse` / `ProjectListResponse` / `JobOpeningListResponse` — lightweight
  versions without nested children (for list endpoints)
- `ServiceResponse` / `ProjectResponse` / `JobOpeningResponse` — full with nested data
  (for detail endpoints)
- `ReorderItem` (in each schema file that needs it): `{ id: UUID, order_index: int ≥ 0 }`
- All `slug` fields use `pattern=r"^[a-z0-9-]+$"`
- `TestimonialBase.rating`: `Field(ge=1, le=5)`
- All `order_index` fields: `Field(ge=0)`
- Passwords: `Field(min_length=8)`

### Sprint 6 — Authentication Service

File: `app/services/auth_service.py`

| Function | Signature | Behaviour |
|---|---|---|
| `get_admin_by_email` | `(db, email) → AdminUser \| None` | DB query by email |
| `authenticate_admin` | `(db, email, password) → AdminUser \| None` | Checks existence, is_active, bcrypt; updates last_login on success |
| `create_access_token_for_admin` | `(admin) → str` | JWT with `sub=admin.id`, `email=admin.email` |
| `change_password` | `(db, admin_id, old, new) → bool` | Verifies old hash, writes new hash, commits |

Design choices:
- `authenticate_admin` returns `None` for all failures (no user enumeration)
- `authenticate_admin` commits `last_login` update inline (simple; documented trade-off)
- `change_password` returns `bool` (router converts False to 400)
- No `role` claim in JWT — `AdminUser` model has no role column

### Sprint 7 — Authentication Router

File: `app/routers/auth.py`
Registered in `main.py` under prefix `/v1`.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/v1/auth/login` | Public | Returns `TokenResponse` |
| GET | `/v1/auth/me` | Bearer | Returns `AdminUserResponse` |
| PUT | `/v1/auth/change-password` | Bearer | Returns `{"message": "..."}` |
| POST | `/v1/auth/logout` | Bearer | Stateless — returns `{"message": "..."}` |

`TokenResponse.expires_in` = `JWT_EXPIRE_MINUTES * 60` (seconds).

`get_current_admin` dependency (in `dependencies.py`):
1. `HTTPBearer(auto_error=False)` → raises 401 (not 403) when header missing
2. `decode_token()` → catches `ExpiredSignatureError` (401 "Token has expired")
   and `InvalidTokenError` (401 "Invalid token") separately
3. Converts `sub` string to `UUID()` before DB query
4. Checks `is_active`; raises 401 if False

Session reuse: FastAPI caches `get_db` per request (`use_cache=True` default),
so `get_current_admin` and a route's own `db=Depends(get_db)` share the same Session.

### Sprint 8 — Cloudinary Upload Service

Files: `app/services/cloudinary_service.py`, `app/routers/upload.py`
Registered in `main.py` under prefix `/v1`.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/v1/admin/upload/image` | Bearer | Upload image (JPEG/PNG/WebP/GIF, max 10 MB) |
| POST | `/v1/admin/upload/pdf` | Bearer | Upload PDF (max 20 MB) |
| DELETE | `/v1/admin/upload` | Bearer | Delete by `public_id` + `resource_type` |

Cloudinary configuration:
- Images: folder `wellman-group/images/`, `quality="auto"`, `fetch_format="auto"`
- PDFs: folder `wellman-group/pdfs/`, `resource_type="raw"`
- Configured at module import time from settings
- Blocking SDK calls wrapped in `asyncio.to_thread()` in async route handlers

`DeleteRequest` uses `Literal["image", "raw"]` for `resource_type` — Pydantic
validates it automatically.

Image response: `{ url, public_id, width, height, format, size }`
PDF response: `{ url, public_id, size }`

---

## 4. Current Sprint

**Sprint 8 is complete. No sprint is currently in progress.**

---

## 5. Pending Fixes (from PROJECT_AUDIT.md)

Apply these before starting Sprint 9. They are ordered by priority.

### P0 — Must do first (blocks all runtime testing)

```bash
cd wellman-group/backend
venv/Scripts/pip install -r requirements.txt
```

The venv contains only pip and setuptools. No application packages are installed.

### P1 — Fix before CRUD routers (will cause 500 errors on any GET)

Four model-schema nullability mismatches — the model allows NULL but the schema
requires a non-Optional value. Any GET endpoint that serializes a row with NULL
in one of these columns will crash with a Pydantic ValidationError (→ 500).

**`app/schemas/hero_slide.py`** — `HeroSlideBase`:
```python
# BEFORE (wrong):
subheading: str = Field(min_length=1, max_length=500)
# AFTER (correct):
subheading: Optional[str] = Field(default=None, max_length=500)
```

**`app/schemas/team.py`** — `TeamMemberBase`:
```python
# BEFORE (wrong):
bio: str
photo_url: str
# AFTER (correct):
bio: Optional[str] = None
photo_url: Optional[str] = None
```

**`app/schemas/testimonial.py`** — `TestimonialBase`:
```python
# BEFORE (wrong):
photo_url: str
# AFTER (correct):
photo_url: Optional[str] = None
```

### P2 — Fix before production

**Restore FK indexes** (dropped by migration bc3d5d302a1d):

Add `index=True` to FK columns in models:
```python
# service.py — ServiceImage, ServiceFeature
service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"), nullable=False, index=True)

# project.py — Project
service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"), nullable=False, index=True)

# project.py — ProjectImage
project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False, index=True)

# job.py — JobApplication
job_id = Column(UUID(as_uuid=True), ForeignKey("job_openings.id"), nullable=False, index=True)
```

Then generate and apply a migration:
```bash
alembic revision --autogenerate -m "restore_fk_indexes"
alembic upgrade head
```

**Replace `.env` placeholders:**
```bash
# Generate a real JWT secret:
python -c "import secrets; print(secrets.token_hex(32))"
# Then update .env:
JWT_SECRET=<generated value>
CLOUDINARY_CLOUD_NAME=<real value from Cloudinary dashboard>
CLOUDINARY_API_KEY=<real value>
CLOUDINARY_API_SECRET=<real value>
```

### P3 — Low priority cleanup

**Unused imports (harmless, just noise):**
- `models/hero_slide.py`: `DateTime, func` — HeroSlide has no timestamp columns
- `models/certificate.py`: `Text` — all columns use `String` or `Date`
- `alembic/env.py`: `import os` — never referenced

**Dead packages in `requirements.txt`:**
- `python-jose[cryptography]==3.3.0` — unused (code uses PyJWT)
- `cors==1.0.1` — wrong package, unrelated to FastAPI's CORSMiddleware

---

## 6. Known Issues

| # | Issue | Impact | Fix Location |
|---|---|---|---|
| 1 | venv empty | App cannot start | Run `pip install -r requirements.txt` |
| 2 | 4 schema nullable mismatches | 500 on any list/detail GET | See P1 in section 5 |
| 3 | 5 FK indexes missing after migrations | Slow JOINs at scale | See P2 in section 5 |
| 4 | Cloudinary creds are placeholders | Upload routes return 502 | Set real creds in `.env` |
| 5 | JWT_SECRET is human-readable placeholder | Security risk in production | Replace with random hex |
| 6 | No token blocklist | Logout is client-side only; tokens valid until exp | Needs Redis if required |
| 7 | No `POST /auth/refresh` | Clients must re-login every 24h | Future sprint |
| 8 | No initial admin user seeded | Cannot log in after fresh DB setup | See seeding note below |
| 9 | Content-type spoofing on upload | Client can lie about file type | Add python-magic check |

**Admin user seeding** (issue 8):
There is no seed script. After a fresh database, create an admin user directly:
```python
from app.database import SessionLocal
from app.models.admin_user import AdminUser
from app.core.security import hash_password
import uuid

db = SessionLocal()
admin = AdminUser(
    id=uuid.uuid4(),
    name="Admin",
    email="admin@wellmangroup.in",
    password_hash=hash_password("your_password_here"),
    is_active=True,
)
db.add(admin)
db.commit()
db.close()
```

---

## 7. Database State

**Engine:** PostgreSQL
**Database name:** `wellman_db`
**Host:** localhost:5432
**User:** postgres
**Connection string:** `postgresql://postgres:Kar%402005@localhost:5432/wellman_db`

**Tables (all 15 exist after `alembic upgrade head`):**

```
admin_users         — single admin row (must be seeded manually)
services            — 8 predefined services (must be seeded manually)
service_images      — FK → services.id
service_features    — FK → services.id
projects            — FK → services.id
project_images      — FK → projects.id
team_members
clients
testimonials
hero_slides
job_openings
job_applications    — FK → job_openings.id
certificates
inquiries
site_settings       — intended as single-row config
```

**Migration head:** `bc3d5d302a1d`

**Column nullability after migration bc3d5d302a1d:**
Several `Boolean` and `Integer` columns were changed from `NOT NULL` to `nullable`
(the second migration adjusted these to match what SQLAlchemy autogenerate expected).
This has no functional impact — Python defaults still apply.

**Indexes present after both migrations:**
- Primary keys on all tables
- Unique: `admin_users.email`, `services.slug`, `projects.slug`
- FK indexes (service_id, project_id, job_id) were DROPPED by migration bc3d5d302a1d
  (see P2 fix in section 5)

---

## 8. Auth State

**Algorithm:** HS256
**Token lifetime:** 1440 minutes (24 hours) — configurable via `JWT_EXPIRE_MINUTES`
**JWT payload:**
```json
{
  "sub": "<admin UUID as string>",
  "email": "<admin email>",
  "exp": <UTC timestamp>
}
```

**Token validation flow (in `get_current_admin`):**
1. Extract Bearer token from `Authorization` header
2. `decode_token()` — raises `ExpiredSignatureError` or `InvalidTokenError` on failure
3. Read `sub` claim → convert to `UUID` → query `admin_users` by primary key
4. Check `is_active` — return 401 if False
5. Return `AdminUser` ORM object

**Active routes:**
- `POST /v1/auth/login` → returns `{ access_token, token_type, expires_in }`
- `GET /v1/auth/me` → returns admin profile
- `PUT /v1/auth/change-password` → returns success message
- `POST /v1/auth/logout` → returns success message (stateless)

**What does NOT exist:**
- Refresh tokens
- Token blocklist / Redis
- Role-based access control (model has no role column)
- Admin CRUD endpoints (create/list/delete admins)

**How to get a token for testing:**
```bash
curl -X POST http://localhost:8000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wellmangroup.in","password":"your_password"}'
```

---

## 9. Upload State

**Service file:** `app/services/cloudinary_service.py`
**Router file:** `app/routers/upload.py`
**Cloudinary account:** Not yet configured (placeholders in `.env`)

**Behaviour when credentials are real:**
- Images uploaded to `wellman-group/images/` with auto-quality + auto-format
- PDFs uploaded to `wellman-group/pdfs/` as raw assets (no transcoding)
- Returned `public_id` must be stored by the caller (used for deletion)
- Deletion requires `public_id` + `resource_type` ("image" or "raw")

**Active routes (all require Bearer token):**
- `POST /v1/admin/upload/image` — multipart/form-data, field `file`; max 10 MB
- `POST /v1/admin/upload/pdf` — multipart/form-data, field `file`; max 20 MB
- `DELETE /v1/admin/upload` — JSON body `{ "public_id": "...", "resource_type": "image"|"raw" }`

**Cloudinary folder structure:**
```
wellman-group/
├── images/   ← service images, project images, team photos, client logos, etc.
└── pdfs/     ← certificates, brochures
```

---

## 10. Next Recommended Sprint

### Sprint 9 — CRUD Routers

Create all remaining routers under `app/routers/`. Each router follows the same
pattern: public read endpoints + admin CRUD + optional nested sub-routes.

**Routers to create:**

| File | Public routes | Admin routes |
|---|---|---|
| `hero_slides.py` | GET /hero-slides | GET/POST/PUT/DELETE/PATCH reorder |
| `services.py` | GET /services, GET /services/{slug} | full CRUD + images + features |
| `projects.py` | GET /projects, GET /projects/{slug} | full CRUD + images + feature toggle |
| `team.py` | GET /team | full CRUD + reorder |
| `clients.py` | GET /clients | full CRUD + reorder |
| `testimonials.py` | GET /testimonials | full CRUD + reorder |
| `jobs.py` | GET /jobs, GET /jobs/{id}, POST /jobs/{id}/apply | full CRUD + applications |
| `certificates.py` | GET /certificates | full CRUD + reorder |
| `inquiries.py` | POST /inquiries | GET list, GET detail, PATCH read, DELETE |
| `settings.py` | GET /settings | GET admin, PUT, POST brochure |
| `dashboard.py` | — | GET /admin/dashboard |

**All full API routes are defined in PROJECT.md** (the locked API spec).

**Schemas are ready** — import from `app.schemas.<module>`:
- List endpoints → use `XListResponse` (lightweight, no nested children)
- Detail endpoints → use `XResponse` (full with nested children)

**Dependency to use for all admin routes:**
```python
from app.dependencies import get_current_admin, get_db
```

**Before writing Sprint 9, apply P0 and P1 fixes from section 5.**

### Sprint 10 — Email Service (optional)

`app/services/email_service.py` — send email notifications for new inquiries
and job applications. Currently a stub.

### Sprint 11 — Frontend (Admin Panel)

Start with the admin panel shell:
- `admin/layout.tsx` (Sidebar + Topbar)
- `admin/login/page.tsx`
- `admin/page.tsx` (Dashboard)

Then implement each admin section page.

---

## 11. Files Modified Per Sprint

### Sprint 2 (Foundation)
- Created: `app/main.py`, `app/database.py`, `app/dependencies.py`
- Created: `app/core/config.py`, `app/core/security.py`, `app/core/cors.py`

### Sprint 3 (Models)
- Created: `app/models/__init__.py` + 11 model files

### Sprint 4 (Migrations)
- Created: `alembic/env.py`, `alembic.ini`
- Created: `alembic/versions/001_initial_migration.py`
- Created: `alembic/versions/bc3d5d302a1d_initial_migration.py`

### Sprint 5 (Schemas)
- Created: `app/schemas/__init__.py` + 12 schema files

### Sprint 6 (Auth Service)
- Created: `app/services/auth_service.py`
- Modified: `app/core/security.py` — added `extra_claims` param to `create_access_token`

### Sprint 7 (Auth Router)
- Created: `app/routers/auth.py`
- Modified: `app/dependencies.py` — added `get_current_admin()`
- Modified: `app/main.py` — registered auth router

### Sprint 8 (Upload Service)
- Created: `app/services/cloudinary_service.py`
- Created: `app/routers/upload.py`
- Modified: `app/main.py` — registered upload router

---

## 12. Outstanding TODOs

### Blocking (must fix before Sprint 9)

- [ ] `pip install -r requirements.txt` — venv is empty
- [ ] Fix 4 schema nullable mismatches (see P1 in section 5)

### Before Production

- [ ] Replace `.env` JWT_SECRET with a generated random key
- [ ] Set real Cloudinary credentials in `.env`
- [ ] Restore 5 FK indexes via new Alembic migration (see P2 in section 5)
- [ ] Seed initial admin user (see section 6, issue 8)
- [ ] Seed 8 predefined services (slugs are locked in PROJECT.md sitemap)

### Sprint 9 Work

- [ ] Create `app/routers/hero_slides.py`
- [ ] Create `app/routers/services.py`
- [ ] Create `app/routers/projects.py`
- [ ] Create `app/routers/team.py`
- [ ] Create `app/routers/clients.py`
- [ ] Create `app/routers/testimonials.py`
- [ ] Create `app/routers/jobs.py`
- [ ] Create `app/routers/certificates.py`
- [ ] Create `app/routers/inquiries.py`
- [ ] Create `app/routers/settings.py`
- [ ] Create `app/routers/dashboard.py`
- [ ] Register all new routers in `app/main.py`

### Future Sprints

- [ ] Email service (`app/services/email_service.py`)
- [ ] POST /auth/refresh endpoint + refresh token column on AdminUser
- [ ] Frontend: admin login page
- [ ] Frontend: admin layout (Sidebar + Topbar)
- [ ] Frontend: admin dashboard
- [ ] Frontend: all admin CRUD pages
- [ ] Frontend: public pages (home, about, services, projects, etc.)
- [ ] Chatbot proxy endpoint (`app/routers/chatbot.py`)
- [ ] VPS provisioning + Nginx config
- [ ] PM2 process config
- [ ] SSL (Let's Encrypt)
- [ ] DNS cutover to VPS

---

## Quick Reference

### Run the backend (after pip install)

```bash
cd wellman-group/backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### API docs (when running)

```
http://localhost:8000/v1/docs      ← Swagger UI
http://localhost:8000/v1/redoc     ← ReDoc
http://localhost:8000/health       ← Liveness check
http://localhost:8000/v1/health    ← Health check with DB ping
```

### Run the frontend

```bash
cd wellman-group/frontend
npm install   # if node_modules missing
npm run dev   # starts on http://localhost:3000
```

### Alembic cheat sheet

```bash
cd backend
alembic upgrade head          # apply all pending migrations
alembic current               # show applied revision
alembic history --verbose     # show full chain
alembic revision --autogenerate -m "description"  # generate new migration
alembic downgrade -1          # roll back one step
```

### Environment variables reference

| Variable | Required | Default | Notes |
|---|---|---|---|
| `DATABASE_URL` | YES | — | PostgreSQL connection string |
| `JWT_SECRET` | YES | — | Random hex string; change before production |
| `JWT_ALGORITHM` | no | HS256 | Do not change |
| `JWT_EXPIRE_MINUTES` | no | 1440 | 24 hours |
| `CLOUDINARY_CLOUD_NAME` | no | "" | Required for uploads |
| `CLOUDINARY_API_KEY` | no | "" | Required for uploads |
| `CLOUDINARY_API_SECRET` | no | "" | Required for uploads |
| `CHATBOT_API_URL` | no | http://localhost:8001 | RAG service URL |
| `CORS_ORIGINS` | no | [wellmangroup.in, localhost:3000] | JSON array string |
| `DEBUG` | no | False | Set True for SQL logging |
| `APP_NAME` | no | Wellman Group API | Shown in Swagger |
| `APP_VERSION` | no | 1.0.0 | Shown in Swagger |
| `API_V1_PREFIX` | no | /v1 | URL prefix for all routes |
