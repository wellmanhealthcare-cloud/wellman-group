# New Session Prompt — Wellman Group Website
> Paste this entire block at the start of every new Claude Code session.

---

Read PROJECT.md and STATUS.md first to get full context. Then continue below.

---

## Project in one line
Full rebuild of wellmangroup.in — Next.js 16 + FastAPI + PostgreSQL + Cloudinary. Custom CMS, no third-party CMS. **97% complete. UI redesign in progress (Sprint 22), then deployment (Sprint 21).**

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

### Frontend — pages all built
- All public pages: Home, About, Services, Projects, Clients, Career, Certificates, Contact
- All admin pages: Dashboard, Hero Slides, Services, Projects, Team, Clients, Testimonials, Jobs, Applications, Certificates, Inquiries, Settings
- Career page has CV application form (submits to inquiries API)
- Navbar has "More" dropdown (Clients, Certificates, Career)
- HeroSlider is active on homepage (not static Hero.tsx)

### Database — seeded and live
- 8 Services, 7 Team Members, 124 Clients (NOTE: 248 rows due to dup seed — dedup needed), 20 Projects, Site Settings

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

### What's already updated with new design
- `app/layout.tsx` — Plus Jakarta Sans font ✅
- `app/globals.css` — new color vars, `#F5F8FC` bg, no blobs ✅
- `components/layout/Navbar.tsx` — full rebuild, new brand system ✅

---

## 🔴 Sprint 22 — UI Redesign (do these next, in order)

### Homepage components
1. **`components/home/HeroSlider.tsx`**
   - Overlay: `linear-gradient(to right, rgba(26,58,107,0.85) 0%, rgba(26,58,107,0.4) 60%, transparent)`
   - Heading: `font-black text-white text-5xl sm:text-6xl`
   - Subheading color: `#B8D5EC`
   - CTA primary: `bg-[#3A8FD4] hover:bg-[#2060B0]`
   - Dots: active `bg-[#3A8FD4]`, inactive `bg-white/30`

2. **`components/home/StatsBar.tsx`**
   - bg: `linear-gradient(135deg, #1A3A6B, #2060B0)`
   - Numbers: `text-4xl font-black text-white`
   - Labels: `text-[#7DC0E4] text-sm`

3. **`components/home/ServicesOverview.tsx`**
   - Remove 8-color ACCENTS system → single brand blue
   - Card: white, left border `3px solid #3A8FD4`
   - Number watermark: `#B8D5EC`

4. **`components/home/AboutSnippet.tsx`** — remove glassmorphism, solid white cards

5. **`components/home/FeaturedProjects.tsx`** — overlay: `rgba(26,58,107,0.8)` → `transparent`

6. **`components/home/Testimonials.tsx`** — solid white cards, quote marks `#3A8FD4`

7. **`components/layout/Footer.tsx`**
   - bg: `#1A3A6B`
   - Text: `rgba(255,255,255,0.65)` / links hover `#7DC0E4`
   - Bottom bar: `rgba(255,255,255,0.08)`

### Public pages — apply card brand style to all
- `app/services/page.tsx` — remove blob hero, brand card style
- `app/services/[slug]/page.tsx` — remove glassmorphism
- `app/about/page.tsx` — remove glassmorphism, blob gradients
- `app/projects/page.tsx` — overlay update
- `app/projects/[slug]/page.tsx`
- `app/clients/page.tsx`
- `app/career/page.tsx`
- `app/certificates/page.tsx`
- `app/contact/page.tsx`

---

## After UI — Sprint 21: Deployment checklist
1. Fix duplicate clients → run `scripts/deduplicate_clients.py`
2. Create GitHub private repo → push code
3. Purchase Hostinger VPS
4. Install: Node.js 20, Python 3.11, PostgreSQL 15, Nginx, PM2, Certbot
5. Nginx: port 3000 → wellmangroup.in, port 8000 → api.wellmangroup.in
6. SSL via Certbot, PM2 + Uvicorn
7. Copy .env files, run migrations + seed scripts on VPS
8. DNS cutover: wellmangroup.in A → VPS IP

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
```
