# Wellman Group — Status
> Update this file after every sprint. Paste into AI sessions alongside PROJECT.md.

**Last Updated:** 2026-06-05 (Session 3)
**Current Phase:** UI Redesign in Progress → then Deployment
**Current Sprint:** Sprint 22 — UI Redesign (brand color system, new design language)

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
UI Redesign (brand system):        25% ███████░░░░░░░░░░░░░░░░░░░░░  ← IN PROGRESS (Session 3)
Deployment:                         0% ░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ← after UI done
────────────────────────────────────────────────────────────────────
OVERALL:                           97% ████████████████████████████
```

---

## ✅ Done — Session 3 (2026-06-05) — Bug Fixes + UI Redesign Sprint Start

### Bug Fixes
- `app/clients/page.tsx` — Removed grayscale/opacity filters; redesigned as photo cards (object-cover, h-28 image + name strip)
- `components/home/ClientLogos.tsx` — Replaced faded image marquee with **text pill marquee** (hospital names + city, scrolling in 2 rows). Building photos don't work as logos.
- `app/services/[slug]/page.tsx` — Added `icon_url` banner image section (was uploaded via admin but never rendered on frontend)
- `backend/app/schemas/service.py` — `long_desc` made `Optional[str] = ""` (was blocking saves when empty)
- `backend/app/routers/services.py` — Update handler converts `None → ""` for long_desc to respect NOT NULL constraint
- `frontend/app/admin/(protected)/services/page.tsx` — Removed long_desc from required validation, removed red * from label
- `app/page.tsx` — **Swapped static `Hero` → `HeroSlider`** (hero images were uploaded to DB but static component was used — now shows real slides)

### Assets
- Logo file copied: `wellman_logo.png` → `frontend/public/wellman_logo.png`
- `components/layout/Navbar.tsx` — Real logo added; **"More" dropdown** added (Clients, Certificates, Career)
- `components/layout/Footer.tsx` — Real logo added

### UI Redesigns (pre-brand-system)
- `components/home/ServicesOverview.tsx` — Redesigned: unique gradient per service, image header, visible "Learn More →", watermark number
- `app/services/page.tsx` — Final design: 3-col grid, `#F5F8FC` bg, dot-grid placeholder, blue accent line on hover, stats strip in hero
- `app/career/page.tsx` — **CV application form** added: Name/Phone/Email/Role/Message → submits to inquiries API → success state shows WhatsApp + Email buttons to send CV

### UI Redesign Sprint — New Brand Design System (Session 3)
**Brand colors extracted from Wellman Group logo (5 blue shades):**
```
--navy:   #1A3A6B   (darkest)
--royal:  #2060B0
--blue:   #3A8FD4
--sky:    #7DC0E4
--powder: #B8D5EC   (lightest)
```

**Files updated so far:**
- `frontend/app/layout.tsx` — Font changed from Geist → **Plus Jakarta Sans** (Google Fonts)
- `frontend/app/globals.css` — New CSS variables, bg `#F5F8FC`, removed blob gradient body bg, removed purple/indigo vars
- `components/layout/Navbar.tsx` — **Full rebuild**: full-width sticky (not floating pill), solid white bg, shadow on scroll, centered nav links, active = `#2060B0` + 2px underline, phone number + gradient CTA button, "More" dropdown preserved

**Design rules now in effect:**
- Background: `#F5F8FC` (not `#ECEEF8`)
- No glassmorphism (`bg-white/80 backdrop-blur`) → solid white cards
- No blob radial-gradients
- No purple/indigo (`#6366f1`) — not in brand
- Font: Plus Jakarta Sans
- Buttons: `#2060B0` → `#1A3A6B` gradient, rounded-full
- Cards: white, `border: 1px solid rgba(58,143,212,0.15)`, soft shadow

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
| S3 | Bug fixes, logo, hero fix, career form, UI redesign system start | see above |

---

## 🔴 Current Sprint — Sprint 22: UI Redesign

### ✅ Done
- [x] Define brand color system from logo
- [x] Update font → Plus Jakarta Sans
- [x] Update globals.css
- [x] Rebuild Navbar

### ⬜ Remaining (do in next session)
- [ ] **HeroSlider** — update overlay gradient + text colors to brand system
- [ ] **StatsBar** — navy→royal gradient bg, white numbers, sky labels
- [ ] **ServicesOverview** — apply new color system (remove purple/indigo gradients)
- [ ] **AboutSnippet** — split layout, remove glassmorphism
- [ ] **FeaturedProjects** — card style update
- [ ] **Testimonials** — card style update
- [ ] **ClientLogos** — minor tweaks if needed
- [ ] **Footer** — dark navy bg (`#1A3A6B`), white text, sky accents
- [ ] **Services page** — apply new card style
- [ ] **About page** — remove glassmorphism, new colors
- [ ] **Projects page** — card overlay update
- [ ] **Clients page** — card border/shadow update
- [ ] **Contact page** — form style update
- [ ] **Career page** — form style update

---

## ⚠️ Known Issues / Blockers

| Issue | Priority | Action |
|-------|----------|--------|
| Duplicate clients in DB (248 rows, should be 124) | P1 — fix before go-live | Run `scripts/deduplicate_clients.py` |
| 5 FK indexes dropped by migration bc3d5d302a1d | P2 — before production | Add `index=True` to FK cols, new alembic revision |
| Hostinger VPS not yet purchased | **Blocker for Sprint 21** | Upgrade Hostinger plan |
| GitHub repo not yet created | Should do now | Create private repo, push current code |
| Chatbot hosting not decided | Blocker for deployment | Decide where RAG service runs |
| `app/services/email_service.py` not built | P2 | Contact form saves to DB but no email alert sent |
| `middleware.ts` deprecation warning in Next.js 16 | P3 | Rename when ready |
| Project images are Unsplash stock photos | Post-launch | Replace via /admin/projects → Images |
| Testimonials section is empty | P2 — before go-live | Collect real quotes, add via /admin/testimonials |

---

## 📋 Content Still Needed (fill via admin panel)

| Section | Status | Action |
|---------|--------|--------|
| Hero Slides | ✅ Uploading (HeroSlider now active) | Add more at /admin/hero-slides |
| Service Images | MOT uploaded, 7 remaining | Upload banner per service at /admin/services |
| Team Photos | No photos | Upload at /admin/team |
| Client Logos | Auto facility photos | Replace poor images at /admin/clients |
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
