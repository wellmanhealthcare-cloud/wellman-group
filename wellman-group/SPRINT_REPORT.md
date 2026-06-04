# Wellman Group — Sprint Report

## Sprint 9: Hero Slides CRUD
**Date:** 2026-06-04
**Status:** ✅ COMPLETE

---

## 1. Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `backend/app/routers/hero_slides.py` | 57 | Hero slides CRUD router — 5 endpoints |

---

## 2. Files Modified

| File | Change |
|------|--------|
| `backend/app/main.py` | Added `hero_slides` to router import + `app.include_router(hero_slides.router, ...)` |

---

## 3. Routes Added

Base prefix: `/v1/hero-slides`

| Method | Path | Auth | Status Code | Description |
|--------|------|------|-------------|-------------|
| GET | `/v1/hero-slides` | Public | 200 | List all active slides ordered by `order_index` |
| GET | `/v1/hero-slides/{id}` | Public | 200 / 404 | Single slide by UUID |
| POST | `/v1/hero-slides` | Bearer | 201 | Create new slide |
| PUT | `/v1/hero-slides/{id}` | Bearer | 200 / 404 | Partial update (exclude_unset) |
| DELETE | `/v1/hero-slides/{id}` | Bearer | 204 / 404 | Soft delete — sets `is_active = False` |

---

## 4. Manual Test Cases

### Setup
```
BASE=http://localhost:8000/v1
TOKEN=<JWT from POST /v1/auth/login>
```

### TC-01 — Create slide (admin)
```http
POST /v1/hero-slides
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "image_url": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  "heading": "Precision Healthcare Infrastructure",
  "subheading": "12+ years. 185+ hospitals. 45+ cities.",
  "cta_text": "Our Services",
  "cta_link": "/services",
  "order_index": 1,
  "is_active": true
}
```
**Expected:** 201 — body includes all fields + generated UUID `id`

### TC-02 — Create slide with optional fields omitted
```http
POST /v1/hero-slides
Authorization: Bearer <TOKEN>
Content-Type: application/json

{"image_url": "https://res.cloudinary.com/demo/image/upload/sample2.jpg", "heading": "Clean Room Solutions"}
```
**Expected:** 201 — `subheading`, `cta_text`, `cta_link` are `null`; `order_index` defaults to `0`; `is_active` defaults to `true`

### TC-03 — List active slides (public)
```http
GET /v1/hero-slides
```
**Expected:** 200 — array sorted by `order_index` ascending; soft-deleted slides absent

### TC-04 — Get single slide (public)
```http
GET /v1/hero-slides/<UUID-from-TC-01>
```
**Expected:** 200 — full slide object

### TC-05 — Get non-existent slide
```http
GET /v1/hero-slides/00000000-0000-0000-0000-000000000000
```
**Expected:** 404 `{"detail": "Slide not found"}`

### TC-06 — Update heading only (admin, partial)
```http
PUT /v1/hero-slides/<UUID-from-TC-01>
Authorization: Bearer <TOKEN>
Content-Type: application/json

{"heading": "Updated Heading"}
```
**Expected:** 200 — only `heading` changed; all other fields unchanged

### TC-07 — Update non-existent slide
```http
PUT /v1/hero-slides/00000000-0000-0000-0000-000000000000
Authorization: Bearer <TOKEN>
Content-Type: application/json

{"heading": "X"}
```
**Expected:** 404 `{"detail": "Slide not found"}`

### TC-08 — Soft delete (admin)
```http
DELETE /v1/hero-slides/<UUID-from-TC-01>
Authorization: Bearer <TOKEN>
```
**Expected:** 204 empty body. Subsequent `GET /v1/hero-slides` must not include this slide.

### TC-09 — Delete non-existent slide
```http
DELETE /v1/hero-slides/00000000-0000-0000-0000-000000000000
Authorization: Bearer <TOKEN>
```
**Expected:** 404 `{"detail": "Slide not found"}`

### TC-10 — Unauthenticated write
```http
POST /v1/hero-slides
Content-Type: application/json

{"image_url": "https://example.com/img.jpg", "heading": "Test"}
```
**Expected:** 401 `{"detail": "Not authenticated"}`

### TC-11 — Invalid UUID in path
```http
GET /v1/hero-slides/not-a-uuid
```
**Expected:** 422 Unprocessable Entity (FastAPI UUID validation, no handler involved)

---

## 5. Known Issues

| # | Severity | Description |
|---|----------|-------------|
| 1 | Low | `GET /v1/hero-slides/{id}` returns any slide regardless of `is_active`. A soft-deleted slide can still be fetched by UUID. Public consumers will not see it in the list, but will get it via direct ID lookup. Decide in Sprint 10 whether this is acceptable. |
| 2 | Low | No hard-delete purge endpoint. Soft-deleted rows accumulate in the database. A `DELETE /admin/hero-slides/{id}/purge` endpoint is out of scope for this sprint. |
| 3 | Info | Write routes use `/v1/hero-slides` (no `/admin/` prefix). PROJECT.md specifies `/admin/hero-slides` for admin write routes. Sprint spec was followed. URL alignment with PROJECT.md should be resolved before Sprint 10. |
| 4 | Info | Reorder (`PATCH /hero-slides/{id}/reorder`) not implemented. `HeroSlideReorder` schema exists and is ready. Out of sprint scope. |
| 5 | Info | Runtime testing blocked until `venv/Scripts/pip install -r requirements.txt` is run. |

---

## 6. Scope Violations

**None.**

| Check | Result |
|-------|--------|
| No model files modified | ✅ |
| No schema files modified | ✅ |
| No service files modified | ✅ |
| No database / core / alembic files modified | ✅ |
| No frontend files modified | ✅ |
| No upload endpoint added | ✅ |
| No Cloudinary changes | ✅ |
| main.py change: router registration only | ✅ |

---

## Implementation Notes

**Soft delete** — `DELETE` sets `is_active = False`. Soft-deleted rows are excluded from the public list via `.filter(HeroSlide.is_active.is_(True))`.

**Partial update** — `PUT` uses `body.model_dump(exclude_unset=True)` so only fields present in the request are written. Fields not sent in the body are untouched.

**UUID path validation** — FastAPI validates UUID format automatically from the `UUID` type annotation. Invalid strings return 422 before the handler is reached.

**Auth enforcement** — `get_current_admin` is declared as a dependency on all write routes. The resolved `AdminUser` object is unused in the handler body — its only purpose is to enforce the auth check.

---

## Previous Sprint Report (Sprint 8: Cloudinary Upload)

Sprint: 8 — Cloudinary Upload Service
Status: COMPLETE

Files Created:
- app/services/cloudinary_service.py
- app/routers/upload.py

Files Modified:
- app/main.py — Added upload router registration

API Routes Added:
  POST   /v1/admin/upload/image   — Protected. Upload image to Cloudinary.
  POST   /v1/admin/upload/pdf     — Protected. Upload PDF to Cloudinary.
  DELETE /v1/admin/upload         — Protected. Delete asset from Cloudinary by public_id.

Known Issues (Sprint 8):
  1. Content-type validation based on header, not file magic bytes.
  2. Blocking SDK calls wrapped in asyncio.to_thread().
  3. File fully buffered in memory before size check.
  4. No deduplication on repeated uploads.
  5. Cloudinary credentials not validated at startup.

---

## Next Sprint

**Sprint 10:** Services CRUD
(public list, public detail by slug, admin CRUD + image management + feature management)
