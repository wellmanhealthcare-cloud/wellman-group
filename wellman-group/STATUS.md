# Wellman Group — Status
> Update this file after every sprint. Paste into AI sessions alongside PROJECT.md.

**Last Updated:** 2026-06-06 (Session 5)
**Current Phase:** UI Redesign — Full scratch redesign in progress
**Current Sprint:** Sprint 22 (renamed) — Complete frontend redesign, page by page

---

## 📊 Overall Progress

```
Backend Core + Models + Schemas:  100% ████████████████████████████
All 14 API Routers:               100% ████████████████████████████
Frontend Setup (types, lib, auth):100% ████████████████████████████
Admin Panel Pages:                100% ████████████████████████████  ✅ Done
Public Pages (structure):         100% ████████████████████████████  ✅ Done
Environment / Credentials:        100% ████████████████████████████  ✅ Done
Real Content (copy + data):       100% ████████████████████████████  ✅ Done
Database Seeding:                  95% ██████████████████████████░░  ← testimonials empty, cert dates wrong
UI Redesign — Foundation:         100% ████████████████████████████  ✅ Sprint 1 done
UI Redesign — Homepage:            80% ██████████████████████░░░░░░  ← hero+stats done, other sections light but not redesigned
UI Redesign — Public Pages:         0% ░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ← Sprints 3–10 remaining
Deployment:                         0% ░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ← after UI done
────────────────────────────────────────────────────────────────────
OVERALL:                           95% ██████████████████████████░░
```

---

## ✅ Done — Session 5 (2026-06-06) — Full Design Reset + Foundation

### Major Design Direction Change
- Scrapped the old glassmorphism / dark-blob design system entirely
- New design: **light background + brand blue grid + floating diamond shapes + gold CTA**
- User reference: Wellman Group brochure cover (light bg, blue diamond motif, bold type)

### Sprint 1 — Design Foundation ✅
- `app/globals.css` — Complete rewrite:
  - `--bg: #EEF4FB` (light blue-white)
  - Blue square-grid background (logo motif): `rgba(58,143,212,0.13)` lines at 44px
  - `btn-gold`, `btn-navy`, `card`, `reveal`, `gold-text`, `navy-text` utility classes
  - Scrollbar styled in brand blue
- `app/layout.tsx` — Floating diamond shapes (brand colors: `#1A3A6B`, `#2060B0`, `#3A8FD4`, `#7DC0E4`, `#B8D5EC`) randomly positioned in page background
- `components/layout/Navbar.tsx` — Full rewrite: transparent → frosted on scroll, gold "Get a Quote" CTA, gold active underline
- `components/layout/Footer.tsx` — Full rewrite: dark `#0D1B2F` footer, gold section headers, gold WhatsApp CTA
- `components/ui/DiamondDecor.tsx` — Updated to regular grid of squares (matches logo motif exactly)

### Sprint 2 — Homepage (partial) ✅
- `components/home/HeroSlider.tsx` — Full rewrite: OT photo hero, gold pill label, diamond grid overlay on right, gold CTA buttons
- `components/home/StatsBar.tsx` — Full rewrite: white cards with counter animation (IntersectionObserver), colored top accent bars
- Other homepage sections (AboutSnippet, ServicesOverview, FeaturedProjects, ClientLogos, Testimonials) — already light-themed, still using old component code but display correctly on new background

### CSS Cache Fix
- Discovered Turbopack serves stale CSS after globals.css changes
- Fix: add/modify a comment in globals.css to force recompile

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
| 9–15 | All 14 API routers complete | app/routers/* |
| 16–20 | Full frontend: admin panel + all public pages | frontend/* |
| S1 | Credentials, seeding: settings, 8 services, 3 team, 124 clients | backend/.env, seed scripts |
| S2 | Real content, 7 team, 20 projects, API improvements, UI polish | multiple files |
| S3 | Bug fixes, logo, hero fix, career form, certificates seeded | see S3 notes |
| S4 | Homepage redesign (old system), delete bug fix, GitHub push | see S4 notes |
| S5 | Full design reset, new design system, Sprint 1+2 foundation | see S5 notes above |

---

## 🔴 Current Sprint — Sprints 3–10: Public Pages Redesign

**Order to follow:**
1. Sprint 3 — `app/about/page.tsx`
2. Sprint 4 — `app/services/page.tsx`
3. Sprint 5 — `app/services/[slug]/page.tsx`
4. Sprint 6 — `app/projects/page.tsx` + `app/projects/[slug]/page.tsx`
5. Sprint 7 — `app/clients/page.tsx`
6. Sprint 8 — `app/certificates/page.tsx`
7. Sprint 9 — `app/career/page.tsx`
8. Sprint 10 — `app/contact/page.tsx`

**Rule:** Build one sprint → screenshot → user approves → next sprint.

---

## ⚠️ Known Issues / Blockers

| Issue | Priority | Action |
|-------|----------|--------|
| Duplicate clients in DB (248 rows, should be 124) | P1 — fix before go-live | Run `scripts/deduplicate_clients.py` |
| 5 FK indexes dropped by migration bc3d5d302a1d | P2 — before production | Add `index=True` to FK cols, new alembic revision |
| Hostinger VPS not yet purchased | **Blocker for deployment** | Upgrade Hostinger plan |
| Chatbot hosting not decided | Blocker for chatbot widget | Decide where RAG service runs, update CHATBOT_API_URL |
| `app/services/email_service.py` not built | P2 | Contact form saves to DB but no email alert sent |
| Testimonials section is empty | P2 — before go-live | Collect real quotes, add via /admin/testimonials |
| Certificate issue dates wrong | P3 | Update from actual documents via /admin/certificates |
| CSS cache (Turbopack) | Known | Touch globals.css (add/change a comment) to force recompile |

---

## 📋 Content Still Needed (fill via admin panel)

| Section | Status | Action |
|---------|--------|--------|
| Hero Slides | ✅ Active | Add more OT photos at /admin/hero-slides |
| Service Images | MOT uploaded, 7 remaining | Upload banner per service at /admin/services |
| Team Photos | No photos | Upload at /admin/team |
| Client Logos | Text pill marquee | Replace poor images at /admin/clients |
| Testimonials | **Empty** | Collect 3–5 real client quotes |
| Certificates | 12 seeded (dates approximate) | Fix dates via /admin/certificates |
| Social Media URLs | Blank | Add at /admin/settings |
| Google Maps URL | Blank | Add embed URL at /admin/settings |

---

## 🎨 New Design System (Session 5 — enforce from here)

```
Background:  #EEF4FB  (light blue-white)
Grid:        rgba(58,143,212,0.13) lines at 44px — logo square-grid motif
Gold CTA:    #F0A500 → #E09400  (btn-gold class)
Navy CTA:    #1A3A6B → #2060B0  (btn-navy class)
Cards:       bg-white, border: 1px solid rgba(32,96,176,0.1), shadow: 0 2px 20px rgba(26,58,107,0.06)
Footer:      background: #0D1B2F (dark navy)
Navbar:      transparent → rgba(238,244,251,0.92) on scroll
Active link: gold underline #F0A500
DiamondDecor: regular grid of squares (not diamond arrangement)
```

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

### CSS Cache Fix (if background looks wrong)
```
Add or change a comment in frontend/app/globals.css → save → wait 3s → refresh
```

### Git
```bash
git push origin main
```

### Cloudinary
```
Cloud Name: dsshewavy
Folder:     wellman/clients, wellman/services, wellman/team, wellman/projects, wellman/certificates
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
