# New Session Prompt — Wellman Group Website
> Paste this entire block at the start of every new Claude Code session.

---

Read PROJECT.md and STATUS.md first to get full context. Then continue below.

---

## Project in one line
Full rebuild of wellmangroup.in — Next.js 16 + FastAPI + PostgreSQL + Cloudinary. Custom CMS, no third-party CMS. **98% complete. Homepage UI redesign done. Public pages redesign remaining, then deployment.**

---

## Tech stack
- Frontend: Next.js 16.2.7, App Router, **no `src/` folder** (files are at `frontend/app/`, `frontend/components/`, etc.)
- Styling: Plain Tailwind CSS — **shadcn/ui NOT installed**
- Backend: FastAPI, SQLAlchemy 2.0, PostgreSQL, Alembic
- Storage: Cloudinary
- Font: **Plus Jakarta Sans** (Google Fonts, loaded in layout.tsx)

---

## ✅ Already done — DO NOT redo

### Backend — 100% complete
- 15 DB tables, all migrations applied, all 50+ endpoints working
- `backend/.env` — all credentials filled
- Delete bug fixed: all 7 routers use `db.delete()` (not `is_active = False`)

### Frontend — pages + homepage components all built
- All public pages: Home, About, Services, Projects, Clients, Career, Certificates, Contact
- All admin pages: Dashboard, Hero Slides, Services, Projects, Team, Clients, Testimonials, Jobs, Applications, Certificates, Inquiries, Settings
- Career page has CV application form (submits to inquiries API)
- Navbar has "More" dropdown (Clients, Certificates, Career)
- HeroSlider is active on homepage (not static Hero.tsx)

### Homepage components — all redesigned with brand system
- `HeroSlider`, `StatsBar`, `ServicesOverview`, `AboutSnippet`, `FeaturedProjects`, `Testimonials`, `ClientLogos`, `Footer` — all updated
- `Navbar` — full rebuild, brand system
- `Admin Sidebar` — real logo in white container

### Database — seeded and live
- 8 Services, 7 Team Members, 124 Clients (NOTE: 248 rows due to dup seed — dedup needed), 20 Projects, Site Settings

### Git
- Single repo: `github.com/morikaransinh/Wellman-Rebuild` (branch: `main`)
- Push: `git push origin main` from `c:/Users/admin/Desktop/wellman group`

---

## 🎨 Current design system — ENFORCE STRICTLY

### Brand colors (from Wellman logo — 5 blue shades only)
```
--navy:   #1A3A6B   ← darkest (footer bg, dark sections, CTA buttons)
--royal:  #2060B0   ← primary (active links, primary buttons)
--blue:   #3A8FD4   ← medium (accents, borders, eyebrow labels)
--sky:    #7DC0E4   ← light (labels on dark bg, hover accents)
--powder: #B8D5EC   ← lightest (watermark numbers, subtle fills)
--bg:     #F5F8FC   ← page background
--white:  #FFFFFF   ← card background
```

### Rules (no exceptions)
- ❌ NO `bg-white/80 backdrop-blur` — use solid `bg-white`
- ❌ NO blob `radial-gradient` backgrounds
- ❌ NO purple/indigo (`#6366f1`, `#818cf8`, `#ECEEF8`, `#3E63DD`)
- ❌ NO Geist font
- ✅ Cards: `bg-white`, `border: 1px solid rgba(58,143,212,0.15)`, `box-shadow: 0 2px 12px rgba(26,58,107,0.06)`, `rounded-2xl`
- ✅ Card hover: `box-shadow: 0 8px 32px rgba(26,58,107,0.12)`, `translateY(-4px)`
- ✅ Dark sections: `background: linear-gradient(135deg, #1A3A6B 0%, #2060B0 100%)`
- ✅ Primary button: `#2060B0` → `#1A3A6B` gradient, `rounded-full`
- ✅ Section eyebrow: uppercase, `tracking-widest`, `text-[#3A8FD4]`, `text-xs`
- ✅ Tailwind only — no new packages — inline styles allowed for gradients/shadows

### Already updated with new design
- `app/layout.tsx` — Plus Jakarta Sans font ✅
- `app/globals.css` — new color vars, `#F5F8FC` bg, no blobs ✅
- `components/layout/Navbar.tsx` ✅
- `components/layout/Footer.tsx` ✅
- `components/home/*` — all 7 components ✅
- `components/admin/Sidebar.tsx` — real logo ✅

---

## 🔴 Sprint 22 — Remaining: Public Pages UI Redesign

Apply brand design rules to each page (remove glassmorphism, blob gradients, purple/indigo, old card styles):

1. `app/services/page.tsx`
2. `app/services/[slug]/page.tsx`
3. `app/about/page.tsx`
4. `app/projects/page.tsx`
5. `app/projects/[slug]/page.tsx`
6. `app/clients/page.tsx`
7. `app/career/page.tsx`
8. `app/certificates/page.tsx`
9. `app/contact/page.tsx`

---

## 🔜 Sprint 23 — Chatbot Widget (after public pages done)
- Build `components/layout/ChatbotWidget.tsx` — floating bubble bottom-right, opens chat window
- Backend proxy already built at `POST /v1/chat` (forwards to `CHATBOT_API_URL`)
- Chatbot hosting not decided yet — just update `CHATBOT_API_URL` in `backend/.env` when ready
- Mount widget in `app/layout.tsx` (public pages only, not admin)

---

## After UI — Sprint 21: Deployment checklist
1. Fix duplicate clients → run `scripts/deduplicate_clients.py`
2. Purchase Hostinger VPS
3. Install: Node.js 20, Python 3.11, PostgreSQL 15, Nginx, PM2, Certbot
4. Nginx: port 3000 → wellmangroup.in, port 8000 → api.wellmangroup.in
5. SSL via Certbot, PM2 + Uvicorn
6. Copy .env files, run migrations + seed scripts on VPS
7. DNS cutover: wellmangroup.in A → VPS IP

---

## Key gotchas
| Thing | Detail |
|---|---|
| Next.js folder | No `src/` — files at `frontend/app/`, `frontend/components/` etc. |
| shadcn/ui | NOT installed — plain Tailwind only |
| Lucide icons | `Linkedin` removed — use `ExternalLink` instead |
| Settings router | Aliased as `settings_router` in main.py |
| long_desc | Optional in services schema (default="") |
| DB password | `Kar@2005` → URL-encoded `Kar%402005` |
| Clients in DB | 248 rows (should be 124) — duplicate seed issue |
| Logo on dark bg | Wrapped in `bg-white rounded-xl px-3 py-2` container |
| Event handlers | Footer/Sidebar are Server Components — no onMouseEnter/onMouseLeave |
| Delete endpoints | All use `db.delete()` — soft delete bug already fixed |

## Quick start
```bash
# Backend
cd wellman-group/backend
venv/Scripts/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend
cd wellman-group/frontend
npm run dev   # http://localhost:3000

# Admin: http://localhost:3000/admin/login
# Email: admin@wellmangroup.in  |  Password: Kar@2005

# Push to GitHub
git push origin main
```
