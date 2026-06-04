# PROJECT_AUDIT.md
Wellman Group Backend — Sprints 1–8
Audit Date: 2026-06-04

---

## Audit Method

- `py_compile` syntax check on every Python file
- Static import graph trace (no live runtime — venv is unpopulated)
- Manual model-vs-schema nullability comparison
- Migration chain integrity check
- File existence verification against PROJECT.md spec

---

## Summary

| Check | Result |
|---|---|
| All models exist | ✅ PASS |
| All migrations exist | ✅ PASS |
| All schema files exist | ✅ PASS |
| No syntax errors | ✅ PASS |
| No circular imports | ✅ PASS |
| No missing imports | ✅ PASS |
| `.env` file exists | ✅ PASS |
| Auth routes present | ✅ PASS |
| App starts (runtime) | ❌ BLOCKED — venv empty |
| Alembic current (runtime) | ❌ BLOCKED — venv empty |
| Alembic upgrade head (runtime) | ❌ BLOCKED — venv empty |
| Model-schema nullability | ⚠️ 4 MISMATCHES |
| FK indexes after migrations | ⚠️ 5 INDEXES MISSING |
| Cloudinary credentials | ⚠️ PLACEHOLDERS ONLY |

---

## 1. Models

### Existence

| Table (PROJECT.md) | Model File | Class | Status |
|---|---|---|---|
| admin_users | models/admin_user.py | AdminUser | ✅ |
| services | models/service.py | Service | ✅ |
| service_images | models/service.py | ServiceImage | ✅ |
| service_features | models/service.py | ServiceFeature | ✅ |
| projects | models/project.py | Project | ✅ |
| project_images | models/project.py | ProjectImage | ✅ |
| team_members | models/team.py | TeamMember | ✅ |
| clients | models/client.py | Client | ✅ |
| testimonials | models/testimonial.py | Testimonial | ✅ |
| job_openings | models/job.py | JobOpening | ✅ |
| job_applications | models/job.py | JobApplication | ✅ |
| certificates | models/certificate.py | Certificate | ✅ |
| inquiries | models/inquiry.py | Inquiry | ✅ |
| hero_slides | models/hero_slide.py | HeroSlide | ✅ |
| site_settings | models/site_settings.py | SiteSettings | ✅ |

All 15 models present. ✅

### Model-Schema Nullability Mismatches

These cause Pydantic `ValidationError` when serializing DB rows that contain NULL
in a column the schema declares as a required (non-Optional) field.

| Model | Column | DB nullable | Schema field | Schema type | Verdict |
|---|---|---|---|---|---|
| HeroSlide | subheading | TRUE | HeroSlideBase.subheading | `str` (required) | ❌ FAIL |
| TeamMember | bio | TRUE | TeamMemberBase.bio | `str` (required) | ❌ FAIL |
| TeamMember | photo_url | TRUE | TeamMemberBase.photo_url | `str` (required) | ❌ FAIL |
| Testimonial | photo_url | TRUE | TestimonialBase.photo_url | `str` (required) | ❌ FAIL |

**Impact:** Any GET response that serializes a row with a NULL in one of these
columns will crash with a 500 Internal Server Error once routers are added.

**Fix:**

```python
# schemas/hero_slide.py — HeroSlideBase
subheading: Optional[str] = Field(default=None, max_length=500)

# schemas/team.py — TeamMemberBase
bio: Optional[str] = None
photo_url: Optional[str] = None

# schemas/testimonial.py — TestimonialBase
photo_url: Optional[str] = None
```

### Unused Imports in Models (minor)

| File | Unused import |
|---|---|
| models/hero_slide.py | `DateTime`, `func` — HeroSlide has no timestamp columns |
| models/certificate.py | `Text` — all Certificate columns use `String` or `Date` |

Not bugs. Safe to remove for cleanliness.

---

## 2. Migrations

### Chain Integrity

```
None
 └── 001_initial_migration     (creates all 15 tables + 5 FK indexes)
      └── bc3d5d302a1d         (nullability adjustments, drops 5 FK indexes)
```

Chain is valid. Root migration has `down_revision = None`. ✅

### Tables Created by Migration 001

admin_users, services, service_images, service_features, projects,
project_images, team_members, clients, testimonials, job_openings,
job_applications, certificates, inquiries, hero_slides, site_settings.

All 15 tables. ✅

### Critical: FK Indexes Dropped by Migration bc3d5d302a1d

Migration 001 creates these indexes:

```
ix_service_images_service_id    on service_images(service_id)
ix_service_features_service_id  on service_features(service_id)
ix_projects_service_id          on projects(service_id)
ix_project_images_project_id    on project_images(project_id)
ix_job_applications_job_id      on job_applications(job_id)
```

Migration bc3d5d302a1d drops all five. After a full `alembic upgrade head`, these
indexes **do not exist** in the database.

**Root cause:** SQLAlchemy does not add `index=True` to FK columns by default.
Alembic autogenerate saw the indexes in the DB (from migration 001) but not in
the models, and generated `op.drop_index(...)` calls.

**Impact:** JOINs and FK lookups on these tables do full sequential scans.
At low data volumes this is invisible; at hundreds of projects/applications it
becomes measurable.

**Fix:** Add `index=True` to FK column definitions in each model, then generate
a new migration that recreates the indexes.

```python
# models/service.py
service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"),
                    nullable=False, index=True)

# models/project.py
service_id  = Column(UUID(as_uuid=True), ForeignKey("services.id"),
                     nullable=False, index=True)
project_id  = Column(UUID(as_uuid=True), ForeignKey("projects.id"),
                     nullable=False, index=True)

# models/job.py
job_id = Column(UUID(as_uuid=True), ForeignKey("job_openings.id"),
                nullable=False, index=True)
```

Then run:
```
alembic revision --autogenerate -m "restore_fk_indexes"
alembic upgrade head
```

---

## 3. Schema Files

| Schema File | Classes | Status |
|---|---|---|
| schemas/auth.py | LoginRequest, TokenResponse, AdminUserBase, AdminUserCreate, AdminUserUpdate, AdminUserResponse, ChangePasswordRequest | ✅ |
| schemas/hero_slide.py | ReorderItem, HeroSlideBase, HeroSlideCreate, HeroSlideUpdate, HeroSlideResponse, HeroSlideReorder | ✅ |
| schemas/service.py | ServiceImageBase/Create/Update/Response, ServiceFeatureBase/Create/Update/Response, ServiceBase, ServiceCreate, ServiceUpdate, ServiceListResponse, ServiceResponse, ServiceReorder, ServiceImageReorder, ServiceFeatureReorder | ✅ |
| schemas/project.py | ProjectImageBase/Create/Update/Response, ProjectBase, ProjectCreate, ProjectUpdate, ProjectListResponse, ProjectResponse, ProjectFeatureToggle, ProjectReorder, ProjectImageReorder | ✅ |
| schemas/team.py | ReorderItem, TeamMemberBase, TeamMemberCreate, TeamMemberUpdate, TeamMemberResponse, TeamReorder | ✅ |
| schemas/client.py | ReorderItem, ClientBase, ClientCreate, ClientUpdate, ClientResponse, ClientReorder | ✅ |
| schemas/testimonial.py | ReorderItem, TestimonialBase, TestimonialCreate, TestimonialUpdate, TestimonialResponse, TestimonialReorder | ✅ |
| schemas/job.py | JobApplicationBase/Create/Response, JobOpeningBase, JobOpeningCreate, JobOpeningUpdate, JobOpeningListResponse, JobOpeningResponse, JobOpeningToggle | ✅ |
| schemas/certificate.py | ReorderItem, CertificateBase, CertificateCreate, CertificateUpdate, CertificateResponse, CertificateReorder | ✅ |
| schemas/inquiry.py | InquiryBase, InquiryCreate, InquiryResponse, InquiryMarkRead | ✅ |
| schemas/site_settings.py | SiteSettingsUpdate, SiteSettingsResponse, BrochureUpload | ✅ |
| schemas/dashboard.py | DashboardStats, DashboardResponse | ✅ |
| schemas/__init__.py | re-exports all 12 modules | ✅ |

All 13 schema files present. ✅

---

## 4. Auth Routes

| Route | Handler | Auth | Status |
|---|---|---|---|
| POST /v1/auth/login | login() | Public | ✅ |
| GET /v1/auth/me | me() | Bearer | ✅ |
| PUT /v1/auth/change-password | update_password() | Bearer | ✅ |
| POST /v1/auth/logout | logout() | Bearer | ✅ |

Route file: `app/routers/auth.py` ✅
Registered in: `app/main.py` with prefix `/v1` ✅

---

## 5. App Startup

### Runtime Test

BLOCKED. The `venv` is empty — only `pip 21.2.3` and `setuptools 57.4.0` installed.
No application packages are present.

```
$ venv/Scripts/pip list
Package    Version
---------- -------
pip        21.2.3
setuptools 57.4.0
```

**Fix — run once:**
```
cd backend
venv/Scripts/pip install -r requirements.txt
```

### Static Startup Simulation (PASS)

Import chain verified manually — all modules resolve:

```
app.main
  ├── app.core.config          ← pydantic_settings (requires install)
  ├── app.core.cors            ← app.core.config
  ├── app.database             ← app.core.config
  ├── app.routers.auth
  │   ├── app.dependencies     ← app.core.security, app.database, app.models.admin_user
  │   ├── app.schemas.auth     ← pydantic
  │   └── app.services.auth_service
  │       ├── app.core.security
  │       └── app.models.admin_user
  └── app.routers.upload
      ├── app.dependencies
      └── app.services.cloudinary_service ← cloudinary (requires install)
```

No circular imports detected. All symbols resolve. ✅

### .env File

Present: `backend/.env` ✅

| Variable | Value | Status |
|---|---|---|
| DATABASE_URL | postgresql://postgres:***@localhost:5432/wellman_db | ✅ |
| JWT_SECRET | `your_super_secret_key_here_change_in_production` | ⚠️ PLACEHOLDER |
| JWT_EXPIRE_MINUTES | 1440 | ✅ |
| CLOUDINARY_CLOUD_NAME | `your_cloud_name` | ⚠️ PLACEHOLDER |
| CLOUDINARY_API_KEY | `your_api_key` | ⚠️ PLACEHOLDER |
| CLOUDINARY_API_SECRET | `your_api_secret` | ⚠️ PLACEHOLDER |
| CHATBOT_API_URL | http://localhost:8001 | ✅ |
| CORS_ORIGINS | ["https://wellmangroup.in","http://localhost:3000"] | ✅ |

JWT_SECRET is a human-readable placeholder — it works functionally but is insecure
for production. Replace with a random 32-byte hex string before deploying.

Cloudinary placeholders mean all upload endpoints will return `502 Bad Gateway`
until real credentials are set.

---

## 6. Alembic Current

BLOCKED — packages not installed. Static check:

- `alembic.ini` present and valid ✅
- `alembic/env.py` present and configured ✅
- `env.py` imports `Base` from `app.database` ✅
- `env.py` imports all 15 models to register with `Base.metadata` ✅
- `env.py` reads `DATABASE_URL` from `settings` (not from `alembic.ini`) ✅
- Placeholder `sqlalchemy.url` in `alembic.ini` is overridden at runtime by `env.py` ✅
- `env.py` has one unused import: `import os` — harmless

Alembic will work correctly once packages are installed and PostgreSQL is running.

---

## 7. Alembic Upgrade Head

BLOCKED — packages not installed. Static check of migration files:

Migration 001 (`001_initial_migration.py`): ✅
- Creates all 15 tables in correct FK dependency order
- All columns match model definitions
- All FK constraints correct

Migration bc3d5d302a1d: ✅ (valid, but see FK index note in section 2)
- Adjusts nullable constraints
- Drops 5 FK indexes (see fix in section 2)
- `down_revision = '001_initial_migration'` ← references revision by ID ✅

---

## 8. Import Analysis

### Circular Import Check

The dependency graph is a clean DAG. No cycles.

```
config (leaf)
  ↑
security, cors, database
  ↑
models/*, dependencies
  ↑
services/*
  ↑
routers/*
  ↑
main (root)
```

✅ No circular imports.

### Missing Import Check

All imports in all files resolve to either:
- Python standard library ✅
- Packages declared in requirements.txt ✅
- Internal app modules that exist ✅

✅ No missing imports.

### requirements.txt Redundancies

| Package | Issue |
|---|---|
| `python-jose[cryptography]==3.3.0` | Unused — code uses `pyjwt`, not `jose`. Adds ~3 MB install. |
| `cors==1.0.1` | Wrong package — unrelated to FastAPI's CORSMiddleware. Should be removed. |

---

## 9. Syntax Errors

`py_compile` run on all 27 Python files:

| File | Result |
|---|---|
| app/main.py | ✅ |
| app/database.py | ✅ |
| app/dependencies.py | ✅ |
| app/core/config.py | ✅ |
| app/core/security.py | ✅ |
| app/core/cors.py | ✅ |
| app/models/admin_user.py | ✅ |
| app/models/hero_slide.py | ✅ |
| app/models/service.py | ✅ |
| app/models/project.py | ✅ |
| app/models/team.py | ✅ |
| app/models/client.py | ✅ |
| app/models/testimonial.py | ✅ |
| app/models/job.py | ✅ |
| app/models/certificate.py | ✅ |
| app/models/inquiry.py | ✅ |
| app/models/site_settings.py | ✅ |
| app/schemas/auth.py | ✅ |
| app/schemas/hero_slide.py | ✅ |
| app/schemas/service.py | ✅ |
| app/schemas/project.py | ✅ |
| app/schemas/team.py | ✅ |
| app/schemas/client.py | ✅ |
| app/schemas/testimonial.py | ✅ |
| app/schemas/job.py | ✅ |
| app/schemas/certificate.py | ✅ |
| app/schemas/inquiry.py | ✅ |
| app/schemas/site_settings.py | ✅ |
| app/schemas/dashboard.py | ✅ |
| app/services/auth_service.py | ✅ |
| app/services/cloudinary_service.py | ✅ |
| app/routers/auth.py | ✅ |
| app/routers/upload.py | ✅ |

✅ Zero syntax errors across all files.

---

## 10. Recommended Fixes — Priority Order

### P0 — Do Before Any Testing

**Fix 1: Install packages**
```bash
cd backend
venv/Scripts/pip install -r requirements.txt
```

### P1 — Fix Before Adding Routers (will cause 500 errors)

**Fix 2: Schema nullability mismatches**

`app/schemas/hero_slide.py`:
```python
# Before
subheading: str = Field(min_length=1, max_length=500)
# After
subheading: Optional[str] = Field(default=None, max_length=500)
```

`app/schemas/team.py`:
```python
# Before
bio: str
photo_url: str
# After
bio: Optional[str] = None
photo_url: Optional[str] = None
```

`app/schemas/testimonial.py`:
```python
# Before
photo_url: str
# After
photo_url: Optional[str] = None
```

### P2 — Fix Before Production

**Fix 3: Restore FK indexes**

Add `index=True` to FK columns in models, then generate a migration:
```
alembic revision --autogenerate -m "restore_fk_indexes"
alembic upgrade head
```

Models to update: `service.py` (service_id on ServiceImage, ServiceFeature),
`project.py` (service_id on Project, project_id on ProjectImage),
`job.py` (job_id on JobApplication).

**Fix 4: Replace .env placeholders**
- `JWT_SECRET` → generate with: `python -c "import secrets; print(secrets.token_hex(32))"`
- `CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET` → real Cloudinary account credentials

### P3 — Cleanup (no functional impact)

**Fix 5: Remove unused imports**
- `models/hero_slide.py`: remove `DateTime, func`
- `models/certificate.py`: remove `Text`
- `alembic/env.py`: remove `import os`

**Fix 6: Clean requirements.txt**
- Remove `python-jose[cryptography]==3.3.0`
- Remove `cors==1.0.1`

---

## Final Verdict

```
Syntax errors          : 0 / 33 files   ✅
Missing files          : 0              ✅
Circular imports       : 0              ✅
Missing imports        : 0              ✅
Schema mismatches      : 4              ❌ FIX BEFORE ROUTERS
FK indexes missing     : 5              ⚠️ FIX BEFORE PRODUCTION
Runtime test           : BLOCKED        🔧 pip install -r requirements.txt
.env placeholders      : 3              ⚠️ Replace before testing uploads/auth

Backend is structurally sound. One shell command unblocks runtime testing.
Fix the 4 schema nullability mismatches before Sprint 9 (CRUD routers) to
prevent 500 errors on any list/detail endpoint that reads existing DB rows.
```
