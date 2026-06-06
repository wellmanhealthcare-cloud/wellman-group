# New Session Prompt — Wellman Group
> Paste this at the start of every new Claude Code session. Then also read STATUS.md.

---

## Project in one line
Full rebuild of wellmangroup.in — Next.js 16 + FastAPI + PostgreSQL + Cloudinary. Custom CMS. **Backend 100% done. Sprint 3 (About page) is next.**

---

## Tech stack
- Frontend: Next.js 16.2.7, App Router, **no `src/` folder** (files are at `frontend/app/`, `frontend/components/`)
- Styling: Plain Tailwind CSS — **shadcn/ui NOT installed** — inline styles for gradients/shadows are fine
- Backend: FastAPI, SQLAlchemy 2.0, PostgreSQL, Alembic
- Storage: Cloudinary (cloud name: `dsshewavy`)
- Font: **Plus Jakarta Sans**

---

## ✅ Already done — DO NOT redo

### Backend — 100%
- 15 DB tables, all migrations applied, all 50+ endpoints working
- Cloudinary upload/delete service ready
- JWT auth: `admin@wellmangroup.in` / `Kar@2005`

### Frontend — structure complete, design in progress
- All admin pages done (Dashboard, Hero Slides, Services, Projects, Team, Clients, Testimonials, Jobs, Applications, Certificates, Inquiries, Settings)
- All public page files exist but most have old dark/glassmorphism design → being rewritten sprint by sprint

### Sprint 1 ✅ — Design Foundation
- `app/globals.css` — rewritten with new design tokens + utility classes (`.btn-gold`, `.btn-navy`, `.card`, `.reveal`, `.gold-text`, `.navy-text`, `.section-divider`)
- `app/layout.tsx` — floating diamond shapes in brand colors as fixed background decor
- `components/layout/Navbar.tsx` — light theme, scroll-aware (transparent → frosted), gold "Get a Quote" CTA
- `components/layout/Footer.tsx` — dark `#0D1B2F`, gold section headers, WhatsApp CTA — has `'use client'`
- `components/ui/DiamondDecor.tsx` — square-grid SVG component (cols × rows grid of small rectangles)

### Sprint 2 ✅ — Homepage
- `components/home/HeroSlider.tsx` — OT photo, gold pill label, diamond grid overlay, gold CTAs, auto-advance
- `components/home/StatsBar.tsx` — white cards, animated counter on scroll (IntersectionObserver, ease-out cubic)
- Other homepage sections (AboutSnippet, ServicesOverview, FeaturedProjects, ClientLogos, Testimonials) — light-themed already, display acceptably on new bg

---

## 🔴 Next: Sprints 3–10 — Public Pages Redesign

Do **one sprint at a time** — screenshot after each → user approves → continue.

| Sprint | File | Status |
|--------|------|--------|
| **3** | `app/about/page.tsx` | **← START HERE** |
| 4 | `app/services/page.tsx` | |
| 5 | `app/services/[slug]/page.tsx` | |
| 6 | `app/projects/page.tsx` + `app/projects/[slug]/page.tsx` | |
| 7 | `app/clients/page.tsx` | |
| 8 | `app/certificates/page.tsx` | |
| 9 | `app/career/page.tsx` | |
| 10 | `app/contact/page.tsx` | currently has OLD glassmorphism design |

---

## 🎨 Design System — ENFORCE STRICTLY

### Background
```
Body:  background-color: #EEF4FB
       background-image: blue grid lines at 44px  (already in globals.css body)
```

### Color palette
```
--bg:      #EEF4FB   page background
--gold:    #F0A500   primary CTA (btn-gold class)
--navy:    #1A3A6B   darkest blue (headings, dark sections)
--royal:   #2060B0   primary blue (active links)
--blue:    #3A8FD4   medium blue (accents, borders)
--sky:     #7DC0E4   light blue
--powder:  #B8D5EC   very light blue (watermarks)
--text:    #0F1F3A   body text
--muted:   rgba(15,31,58,0.55)
```

### Global utility classes (already in globals.css — USE THESE)
- `.btn-gold` — gold CTA (`#F0A500 → #E09400`), dark text, box-shadow
- `.btn-navy` — navy CTA (`#1A3A6B → #2060B0`), white text
- `.card` — white bg, blue border, soft shadow, hover effect
- `.reveal` / `.reveal.visible` — scroll-reveal (add class via IntersectionObserver)
- `.gold-text` — gold gradient background-clip text
- `.navy-text` — navy gradient background-clip text
- `.section-divider` — small 48px × 3px blue gradient bar

### Card style (when NOT using .card class)
```
background: white | rounded-2xl
border: 1px solid rgba(32,96,176,0.1)
box-shadow: 0 2px 20px rgba(26,58,107,0.06)
hover → box-shadow: 0 8px 40px rgba(26,58,107,0.1), border: rgba(32,96,176,0.22)
```

### Section headers pattern
```
<p class="text-xs font-bold uppercase tracking-widest text-[#3A8FD4]">eyebrow</p>
<h2 class="text-4xl font-black text-[#0F1F3A]">Main Heading</h2>
<div class="section-divider mt-3" />
```

### Dark sections (eg CTA banners)
```
background: linear-gradient(135deg, #1A3A6B 0%, #2060B0 100%)
text: white
CTA button: .btn-gold
```

### DO NOT use
- Glassmorphism (`backdrop-blur` cards on light bg)
- Dark blobs / radial gradients on page body
- Purple / indigo colors (`#6366f1`, `#818cf8`, etc.)
- shadcn/ui components

---

## Key Gotchas

| Issue | Detail |
|-------|--------|
| **'use client'** | Any component with `useState`, `useEffect`, `onMouseEnter`, etc. MUST have `'use client'` at the top |
| **CSS cache (Turbopack)** | After editing globals.css, add/change a comment (`/* v2 */` → `/* v3 */`) to force recompile |
| **Logo on light bg** | No CSS filter — brand colors show naturally |
| **Logo on dark bg** | Use `filter: drop-shadow(0 0 4px rgba(255,255,255,0.2))` NOT `brightness(0) invert(1)` |
| **No src/ folder** | Pages are at `frontend/app/`, components at `frontend/components/` |
| **DB password** | `Kar@2005` → URL-encoded as `Kar%402005` |
| **Clients in DB** | 248 rows (should be 124 — dup seed issue). Run `scripts/deduplicate_clients.py` before go-live |

---

## Quick Start

```bash
# Backend
cd wellman-group/backend
venv/Scripts/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend
cd wellman-group/frontend
npm run dev   # http://localhost:3000
```

**Admin:** http://localhost:3000/admin/login → `admin@wellmangroup.in` / `Kar@2005`

**Git:** `git push origin main` (from repo root `wellman group/`)

---

## DiamondDecor component
```tsx
// components/ui/DiamondDecor.tsx
// Usage: <DiamondDecor cols={4} rows={5} color="#2060B0" opacity={0.12} className="absolute top-4 right-4" />
// Renders a cols×rows grid of small squares — matches the logo's square-grid motif
```

---

## What's NOT done yet
- Public pages 3–10 (all still have old design)
- Testimonials (empty — need real client quotes)
- Team photos (not uploaded)
- Hostinger VPS (deployment blocker — not purchased)
- Contact form email notifications
