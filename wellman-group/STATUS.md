# Wellman Group — Status
> Update this file after every sprint. Paste into AI sessions alongside PROJECT.md.

**Last Updated:** 2026-06-06 (Session 4)
**Current Phase:** UI Redesign — Homepage done → Public pages remaining → Deployment
**Current Sprint:** Sprint 22 — UI Redesign (public pages remaining)

---

## 📊 Overall Progress

```
Backend Core + Models + Schemas:  100% ████████████████████████████
All 14 API Routers:               100% ████████████████████████████
Frontend Setup (types, lib, auth):100% ████████████████████████████
Admin Panel Pages:                100% ████████████████████████████  ✅ Sprint 18 done
Public Pages (structure):         100% ████████████████████████████  ✅ Sprint 19 + 20 done
Environment / Credentials:        100% ████████████████████████████  ✅ Done
Real Content (copy + data):       100% ████████████████████████████  ✅ Session 2 done
Database Seeding:                  95% ██████████████████████████░░  ← testimonials + certs still empty
UI Redesign (brand system):        60% █████████████████░░░░░░░░░░░  ← homepage done, public pages next
Deployment:                         0% ░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ← after UI done
────────────────────────────────────────────────────────────────────
OVERALL:                           98% ████████████████████████████
```

---

## ✅ Done — Session 4 (2026-06-06) — Homepage UI Redesign + Bug Fixes

### Delete Bug Fix (all routers)
- `backend/app/routers/team.py` — `db.delete()` replaces `is_active = False`
- `backend/app/routers/certificates.py` — same fix
- `backend/app/routers/clients.py` — same fix
- `backend/app/routers/hero_slides.py` — same fix
- `backend/app/routers/projects.py` — same fix
- `backend/app/routers/services.py` — same fix
- `backend/app/routers/testimonials.py` — same fix

### Logo Fix
- `components/layout/Navbar.tsx` — `mix-blend-multiply` on logo (white bg merges with white navbar)
- `components/layout/Footer.tsx` — logo wrapped in white `rounded-xl` container (visible on dark navy bg)
- `components/admin/Sidebar.tsx` — replaced "W" placeholder with real logo in white container

### Homepage UI Redesign (Sprint 22 — all 8 components done)
- `components/home/HeroSlider.tsx` — brand navy overlay, `#B8D5EC` subheading, `#3A8FD4` CTA + dots
- `components/home/StatsBar.tsx` — **full rewrite**: dark `linear-gradient(135deg, #1A3A6B, #2060B0)` band
- `components/home/ServicesOverview.tsx` — removed 8-color ACCENTS, left `3px solid #3A8FD4` border cards, `#B8D5EC` watermark numbers
- `components/home/AboutSnippet.tsx` — removed glassmorphism, brand color tiles, gradient heading
- `components/home/FeaturedProjects.tsx` — replaced 6-color gradient array with single `#1A3A6B→#2060B0`, brand photo overlay
- `components/home/Testimonials.tsx` — solid white card, `#3A8FD4` quote marks + dots
- `components/layout/Footer.tsx` — **full rewrite**: dark navy `#1A3A6B` bg, `rgba(255,255,255,0.65)` text, `#7DC0E4` icons
- `components/home/ClientLogos.tsx` — `#3E63DD` → `#3A8FD4` (brand color fix)

### Git / GitHub
- Pushed everything to `github.com/morikaransinh/Wellman-Rebuild`
- Frontend was tracked as gitlink — fixed and re-committed as regular files
- Single repo, single `git push origin main` going forward

---

## ✅ Completed Sprints (history)

| Sprint | What Was Built | Key Files |
|--------|----------------|-----------|
| 1 | Project setup, locked spec | PROJECT.md |
| 2 | FastAPI app, SQLAlchemy engine, JWT, CORS, Alembic config | main.py, database.py, dependencies.py, core/* |
| 3 | 11 model files, 15 tables, UUID PKs, relationships + cascade deletes | app/models/* |
| 4 | Alembic env.py, 2 migrations applied (all 15 tables live) | alembic/env.py, alembic/versions/* |
| 5 | 12 schema files, Pydantic v2, Create/Update/Response pattern | app/schemas/* |
| 6 | JWT creation/verification, bcrypt hashing, admin lookup | app/services/auth_service.py |
| 7 | login, me, change-password, logout endpoints | app/routers/auth.py |
| 8 | Image + PDF upload to Cloudinary, delete by public_id | app/services/cloudinary_service.py, app/routers/upload.py |
| 8.1 | Fixed 4 nullable mismatches | app/schemas/hero_slide.py, team.py, testimonial.py |
| 9–15 | All 14 API routers complete | app/routers/* |
| 16–20 | Full frontend: admin panel + all public pages | frontend/* |
| S1 | Credentials, seeding: settings, 8 services, 3 team, 124 clients | backend/.env, seed scripts |
| S2 | Real content, 7 team, 20 projects, API improvements, UI polish | multiple files |
| S3 | Bug fixes, logo, hero fix, career form, UI redesign system start | see S3 notes |
| S4 | Homepage redesign complete, delete bug fix, logo fix, GitHub push | see S4 notes above |

---

## 🔴 Current Sprint — Sprint 22: UI Redesign (public pages remaining)

### ✅ Done
- [x] Define brand color system from logo
- [x] Update font → Plus Jakarta Sans
- [x] Update globals.css
- [x] Rebuild Navbar
- [x] HeroSlider
- [x] StatsBar
- [x] ServicesOverview
- [x] AboutSnippet
- [x] FeaturedProjects
- [x] Testimonials
- [x] ClientLogos
- [x] Footer

### ⬜ Remaining — Public Pages
- [ ] `app/services/page.tsx` — remove blob hero, brand card style
- [ ] `app/services/[slug]/page.tsx` — remove glassmorphism
- [ ] `app/about/page.tsx` — remove glassmorphism, blob gradients
- [ ] `app/projects/page.tsx` — overlay update
- [ ] `app/projects/[slug]/page.tsx` — brand style
- [ ] `app/clients/page.tsx` — card border/shadow update
- [ ] `app/career/page.tsx` — form style update
- [ ] `app/certificates/page.tsx` — brand style
- [ ] `app/contact/page.tsx` — form style update

### 🔜 After UI — Sprint 23: Chatbot Widget
- [ ] Build `components/layout/ChatbotWidget.tsx` (floating bubble + chat window)
- [ ] Wire to `POST /v1/chat` proxy endpoint (already built in backend)
- [ ] Decide chatbot hosting → update `CHATBOT_API_URL` in `backend/.env`

---

## ⚠️ Known Issues / Blockers

| Issue | Priority | Action |
|-------|----------|--------|
| Duplicate clients in DB (248 rows, should be 124) | P1 — fix before go-live | Run `scripts/deduplicate_clients.py` |
| 5 FK indexes dropped by migration bc3d5d302a1d | P2 — before production | Add `index=True` to FK cols, new alembic revision |
| Hostinger VPS not yet purchased | **Blocker for deployment** | Upgrade Hostinger plan |
| Chatbot hosting not decided | Blocker for chatbot widget | Decide where RAG service runs, update CHATBOT_API_URL |
| `app/services/email_service.py` not built | P2 | Contact form saves to DB but no email alert sent |
| `middleware.ts` deprecation warning in Next.js 16 | P3 | Rename when ready |
| Project images are Unsplash stock photos | Post-launch | Replace via /admin/projects → Images |
| Testimonials section is empty | P2 — before go-live | Collect real quotes, add via /admin/testimonials |

---

## 📋 Content Still Needed (fill via admin panel)

| Section | Status | Action |
|---------|--------|--------|
| Hero Slides | ✅ Active (HeroSlider live) | Add more at /admin/hero-slides |
| Service Images | MOT uploaded, 7 remaining | Upload banner per service at /admin/services |
| Team Photos | No photos | Upload at /admin/team |
| Client Logos | Text pill marquee (building photos removed) | Replace poor images at /admin/clients |
| Testimonials | **Empty** | Collect 3–5 real client quotes |
| Certificates | Empty | Add ISO, BS EN 13348, Lloyd certs |
| Social Media URLs | Blank | Add at /admin/settings |
| Google Maps URL | Blank | Add embed URL at /admin/settings |
| Company Brochure | Blank | Upload PDF at /admin/settings |

---

## 🔑 Quick Reference

### Run Backend
```bash
cd wellman-group/backend
venv/Scripts/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Run Frontend
```bash
cd wellman-group/frontend
npm run dev   # http://localhost:3000
```

### Admin Login
```
URL:      http://localhost:3000/admin/login
Email:    admin@wellmangroup.in
Password: Kar@2005
```

### Git
```bash
# Push everything (single repo now)
git push origin main
```

### Cloudinary
```
Cloud Name: dsshewavy
Folder:     wellman/clients, wellman/services, wellman/team, wellman/projects
```

### Database
```
Host:     localhost:5432  |  DB: wellman_db  |  User: postgres
URL:      postgresql://postgres:Kar%402005@localhost:5432/wellman_db
Tables:   15 (alembic head = bc3d5d302a1d)
```

### GitHub
```
Repo:     github.com/morikaransinh/Wellman-Rebuild
Branch:   main
```

---

## ⚙️ Design Decisions Log

| Decision | Choice | Reason |
|----------|--------|--------|
| Font | Plus Jakarta Sans | Premium feel, excellent readability at all weights |
| Body bg | `#F5F8FC` | Subtle blue-white, on-brand, less harsh than pure white |
| No glassmorphism | Solid white cards | Glassmorphism looks dated in 2026 |
| Brand colors | 5 shades from logo | Strict monochromatic blue system, no purple/indigo |
| Navbar | Full-width sticky (not floating pill) | More professional, industry standard |
| HeroSlider | Active on homepage | Static Hero replaced — real uploaded images now show |
| Career page | Form instead of empty state | Users can apply even when no jobs posted |
| Client logos | Text pill marquee | Building photos don't work as small logo thumbnails |
| long_desc | Optional in services | Admin UX — not every service needs long description immediately |
| Logo on dark bg | White rounded container | PNG has white bg — container makes it intentional and clean |
| Delete endpoints | Hard delete `db.delete()` | Soft delete left records visible in admin after deletion |
| Git structure | Single monorepo | Frontend was gitlink — converted to regular files for clean GitHub history |
