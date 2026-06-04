# Wellman Group — Project Bible
> Single source of truth for the complete website rebuild.
> **Start every new AI chat session by pasting this file.**

---

## 🧠 Project Context

**Client:** Wellman Group  
**Managing Director:** Prithvi Solanki  
**Developer:** Prithvi's nephew (AI Engineer + Full Stack Developer)  
**Current site:** https://wellmangroup.in (PHP + jQuery on Hostinger Shared Hosting)  
**Goal:** Complete rebuild from scratch — modern stack, CMS, chatbot, WhatsApp integration  
**Domain:** wellmangroup.in (stays same, DNS pointed to new VPS)

---

## ✅ Tech Stack (Locked)

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| HTTP Client | Axios |
| Backend | FastAPI |
| ORM | SQLAlchemy |
| Migrations | Alembic |
| Database | PostgreSQL |
| File Storage | Cloudinary (images + PDFs) |
| Auth | JWT (single admin, role-ready) |
| Chatbot | Custom RAG service (separate, proxy endpoint in FastAPI) |
| Hosting | Hostinger VPS |
| Web Server | Nginx (reverse proxy) |
| Process Manager | PM2 (Next.js) + Uvicorn (FastAPI) |
| Version Control | GitHub (private repo) |
| Staging | dev.wellmangroup.in |

---

## 🗺️ Sitemap (Locked)

```
wellmangroup.in
│
├── / (Home)
│   ├── Hero Slider
│   ├── Stats (12+ years, 185+ hospitals, 45+ cities)
│   ├── About Snippet
│   ├── Services Overview
│   ├── Featured Projects
│   ├── Client Logos
│   ├── Testimonials
│   ├── WhatsApp Floating Button
│   └── Chatbot Widget
│
├── /about
│   ├── Company Story
│   ├── Mission & Vision
│   ├── Team Members
│   └── Certifications
│
├── /services
│   ├── /services/modular-operation-theatre
│   ├── /services/medical-gas-pipeline-system
│   ├── /services/hvac-cleanroom-engineering
│   ├── /services/clean-room-solutions
│   ├── /services/laminar-air-flow-systems
│   ├── /services/modular-icu-solutions
│   ├── /services/modular-nicu-solutions
│   └── /services/ivf-lab-setup
│
├── /projects
│   ├── Filter by service
│   ├── Filter by city
│   └── /projects/[slug] (detail page)
│
├── /clients
│   └── Logo wall (185+ hospitals, 45+ cities)
│
├── /career
│   ├── Open positions
│   ├── /career/[id] (job detail)
│   └── Apply form
│
├── /certificates
│
├── /contact
│   ├── Inquiry form
│   ├── WhatsApp direct link
│   ├── Address + Google Map
│   └── Social links
│
└── /admin (protected — JWT)
    ├── /admin/login
    ├── /admin (dashboard)
    ├── /admin/hero-slides
    ├── /admin/services
    ├── /admin/projects
    ├── /admin/team
    ├── /admin/clients
    ├── /admin/testimonials
    ├── /admin/jobs
    ├── /admin/certificates
    ├── /admin/inquiries
    └── /admin/settings
```

---

## 🗄️ DB Schema (Locked)

### 1. `admin_users`
```sql
id              UUID        PRIMARY KEY
name            VARCHAR
email           VARCHAR     UNIQUE
password_hash   VARCHAR
is_active       BOOLEAN     DEFAULT true
created_at      TIMESTAMP
last_login      TIMESTAMP
```

### 2. `services`
```sql
id              UUID        PRIMARY KEY
title           VARCHAR
slug            VARCHAR     UNIQUE
short_desc      TEXT
long_desc       TEXT
icon_url        VARCHAR
order_index     INTEGER
is_active       BOOLEAN     DEFAULT true
meta_title      VARCHAR
meta_desc       TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### 3. `service_images`
```sql
id              UUID        PRIMARY KEY
service_id      UUID        FK → services.id
image_url       VARCHAR
caption         VARCHAR
order_index     INTEGER
```

### 4. `service_features`
```sql
id              UUID        PRIMARY KEY
service_id      UUID        FK → services.id
feature_text    VARCHAR
order_index     INTEGER
```

### 5. `projects`
```sql
id              UUID        PRIMARY KEY
title           VARCHAR
slug            VARCHAR     UNIQUE
client_name     VARCHAR
city            VARCHAR
state           VARCHAR
service_id      UUID        FK → services.id
description     TEXT
completion_date DATE
is_featured     BOOLEAN     DEFAULT false
is_active       BOOLEAN     DEFAULT true
order_index     INTEGER
meta_title      VARCHAR
meta_desc       TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### 6. `project_images`
```sql
id              UUID        PRIMARY KEY
project_id      UUID        FK → projects.id
image_url       VARCHAR
caption         VARCHAR
order_index     INTEGER
```

### 7. `team_members`
```sql
id              UUID        PRIMARY KEY
name            VARCHAR
designation     VARCHAR
bio             TEXT
photo_url       VARCHAR
linkedin_url    VARCHAR
order_index     INTEGER
is_active       BOOLEAN     DEFAULT true
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### 8. `clients`
```sql
id              UUID        PRIMARY KEY
hospital_name   VARCHAR
city            VARCHAR
state           VARCHAR
logo_url        VARCHAR
order_index     INTEGER
is_active       BOOLEAN     DEFAULT true
created_at      TIMESTAMP
```

### 9. `testimonials`
```sql
id              UUID        PRIMARY KEY
client_name     VARCHAR
designation     VARCHAR
hospital_name   VARCHAR
message         TEXT
photo_url       VARCHAR
rating          INTEGER
is_active       BOOLEAN     DEFAULT true
order_index     INTEGER
created_at      TIMESTAMP
```

### 10. `job_openings`
```sql
id              UUID        PRIMARY KEY
title           VARCHAR
department      VARCHAR
location        VARCHAR
job_type        VARCHAR
description     TEXT
responsibilities TEXT
requirements    TEXT
is_open         BOOLEAN     DEFAULT true
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### 11. `job_applications`
```sql
id              UUID        PRIMARY KEY
job_id          UUID        FK → job_openings.id
applicant_name  VARCHAR
email           VARCHAR
phone           VARCHAR
resume_url      VARCHAR
cover_letter    TEXT
is_read         BOOLEAN     DEFAULT false
applied_at      TIMESTAMP
```

### 12. `certificates`
```sql
id              UUID        PRIMARY KEY
title           VARCHAR
issuing_body    VARCHAR
issue_date      DATE
expiry_date     DATE
file_url        VARCHAR
order_index     INTEGER
is_active       BOOLEAN     DEFAULT true
created_at      TIMESTAMP
```

### 13. `inquiries`
```sql
id              UUID        PRIMARY KEY
full_name       VARCHAR
company_name    VARCHAR
email           VARCHAR
phone           VARCHAR
subject         VARCHAR
message         TEXT
is_read         BOOLEAN     DEFAULT false
created_at      TIMESTAMP
```

### 14. `hero_slides`
```sql
id              UUID        PRIMARY KEY
image_url       VARCHAR
heading         VARCHAR
subheading      VARCHAR
cta_text        VARCHAR
cta_link        VARCHAR
order_index     INTEGER
is_active       BOOLEAN     DEFAULT true
```

### 15. `site_settings`
```sql
id              UUID        PRIMARY KEY  (always single row)
company_name    VARCHAR
tagline         VARCHAR
unit_address    TEXT
office_address  TEXT
phone_primary   VARCHAR
phone_secondary VARCHAR
email_primary   VARCHAR
email_secondary VARCHAR
whatsapp_number VARCHAR
instagram_url   VARCHAR
facebook_url    VARCHAR
linkedin_url    VARCHAR
youtube_url     VARCHAR
google_maps_url TEXT
brochure_url    VARCHAR
footer_text     VARCHAR
meta_title      VARCHAR
meta_desc       TEXT
updated_at      TIMESTAMP
```

---

## 🛣️ API Routes (Locked)

**Base URL:** `api.wellmangroup.in/v1`

### Auth
```
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
PUT    /auth/change-password
GET    /auth/me
```

### Hero Slides
```
GET    /hero-slides
GET    /admin/hero-slides
POST   /admin/hero-slides
PUT    /admin/hero-slides/{id}
DELETE /admin/hero-slides/{id}
PATCH  /admin/hero-slides/{id}/reorder
```

### Services
```
GET    /services
GET    /services/{slug}
GET    /admin/services
POST   /admin/services
PUT    /admin/services/{id}
DELETE /admin/services/{id}
PATCH  /admin/services/{id}/reorder
POST   /admin/services/{id}/images
DELETE /admin/services/{id}/images/{img_id}
PATCH  /admin/services/{id}/images/reorder
POST   /admin/services/{id}/features
PUT    /admin/services/{id}/features/{feat_id}
DELETE /admin/services/{id}/features/{feat_id}
PATCH  /admin/services/{id}/features/reorder
```

### Projects
```
GET    /projects
GET    /projects/{slug}
GET    /admin/projects
POST   /admin/projects
PUT    /admin/projects/{id}
DELETE /admin/projects/{id}
PATCH  /admin/projects/{id}/feature
PATCH  /admin/projects/{id}/reorder
POST   /admin/projects/{id}/images
DELETE /admin/projects/{id}/images/{img_id}
PATCH  /admin/projects/{id}/images/reorder
```

### Team
```
GET    /team
GET    /admin/team
POST   /admin/team
PUT    /admin/team/{id}
DELETE /admin/team/{id}
PATCH  /admin/team/{id}/reorder
```

### Clients
```
GET    /clients
GET    /admin/clients
POST   /admin/clients
PUT    /admin/clients/{id}
DELETE /admin/clients/{id}
PATCH  /admin/clients/{id}/reorder
```

### Testimonials
```
GET    /testimonials
GET    /admin/testimonials
POST   /admin/testimonials
PUT    /admin/testimonials/{id}
DELETE /admin/testimonials/{id}
PATCH  /admin/testimonials/{id}/reorder
```

### Jobs
```
GET    /jobs
GET    /jobs/{id}
POST   /jobs/{id}/apply
GET    /admin/jobs
POST   /admin/jobs
PUT    /admin/jobs/{id}
DELETE /admin/jobs/{id}
PATCH  /admin/jobs/{id}/toggle
GET    /admin/jobs/{id}/applications
GET    /admin/applications
PATCH  /admin/applications/{id}/read
DELETE /admin/applications/{id}
```

### Certificates
```
GET    /certificates
GET    /admin/certificates
POST   /admin/certificates
PUT    /admin/certificates/{id}
DELETE /admin/certificates/{id}
PATCH  /admin/certificates/{id}/reorder
```

### Inquiries
```
POST   /inquiries
GET    /admin/inquiries
GET    /admin/inquiries/{id}
PATCH  /admin/inquiries/{id}/read
DELETE /admin/inquiries/{id}
```

### Settings
```
GET    /settings
GET    /admin/settings
PUT    /admin/settings
POST   /admin/settings/brochure
```

### Upload
```
POST   /admin/upload/image
POST   /admin/upload/pdf
DELETE /admin/upload
```

### Chatbot
```
POST   /chat
```

### Dashboard
```
GET    /admin/dashboard
```

---

## 📁 Folder Structure (Locked)

```
wellman-group/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── services/page.tsx
│   │   │   ├── services/[slug]/page.tsx
│   │   │   ├── projects/page.tsx
│   │   │   ├── projects/[slug]/page.tsx
│   │   │   ├── clients/page.tsx
│   │   │   ├── career/page.tsx
│   │   │   ├── career/[id]/page.tsx
│   │   │   ├── certificates/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── admin/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx (dashboard)
│   │   │       ├── login/page.tsx
│   │   │       ├── hero-slides/page.tsx
│   │   │       ├── services/page.tsx
│   │   │       ├── services/[id]/page.tsx
│   │   │       ├── projects/page.tsx
│   │   │       ├── projects/[id]/page.tsx
│   │   │       ├── team/page.tsx
│   │   │       ├── clients/page.tsx
│   │   │       ├── testimonials/page.tsx
│   │   │       ├── jobs/page.tsx
│   │   │       ├── jobs/[id]/page.tsx
│   │   │       ├── certificates/page.tsx
│   │   │       ├── inquiries/page.tsx
│   │   │       └── settings/page.tsx
│   │   ├── components/
│   │   │   ├── ui/ (shadcn auto-generated)
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── WhatsAppButton.tsx
│   │   │   │   └── ChatbotWidget.tsx
│   │   │   ├── home/
│   │   │   │   ├── HeroSlider.tsx
│   │   │   │   ├── StatsSection.tsx
│   │   │   │   ├── AboutSnippet.tsx
│   │   │   │   ├── ServicesOverview.tsx
│   │   │   │   ├── FeaturedProjects.tsx
│   │   │   │   ├── ClientLogos.tsx
│   │   │   │   └── Testimonials.tsx
│   │   │   ├── services/
│   │   │   │   ├── ServiceCard.tsx
│   │   │   │   └── ServiceDetail.tsx
│   │   │   ├── projects/
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   ├── ProjectFilter.tsx
│   │   │   │   └── ProjectGallery.tsx
│   │   │   ├── career/
│   │   │   │   ├── JobCard.tsx
│   │   │   │   └── ApplyForm.tsx
│   │   │   ├── contact/
│   │   │   │   └── ContactForm.tsx
│   │   │   └── admin/
│   │   │       ├── Sidebar.tsx
│   │   │       ├── Topbar.tsx
│   │   │       ├── DataTable.tsx
│   │   │       ├── ImageUpload.tsx
│   │   │       └── ConfirmDialog.tsx
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── utils.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useToast.ts
│   │   ├── types/
│   │   │   ├── service.ts
│   │   │   ├── project.ts
│   │   │   ├── team.ts
│   │   │   ├── client.ts
│   │   │   ├── job.ts
│   │   │   ├── inquiry.ts
│   │   │   └── settings.ts
│   │   └── middleware.ts
│   ├── .env.local
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── admin_user.py
│   │   │   ├── service.py
│   │   │   ├── project.py
│   │   │   ├── team.py
│   │   │   ├── client.py
│   │   │   ├── testimonial.py
│   │   │   ├── job.py
│   │   │   ├── certificate.py
│   │   │   ├── inquiry.py
│   │   │   ├── hero_slide.py
│   │   │   └── site_settings.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── service.py
│   │   │   ├── project.py
│   │   │   ├── team.py
│   │   │   ├── client.py
│   │   │   ├── testimonial.py
│   │   │   ├── job.py
│   │   │   ├── certificate.py
│   │   │   ├── inquiry.py
│   │   │   ├── hero_slide.py
│   │   │   ├── site_settings.py
│   │   │   └── dashboard.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── hero_slides.py
│   │   │   ├── services.py
│   │   │   ├── projects.py
│   │   │   ├── team.py
│   │   │   ├── clients.py
│   │   │   ├── testimonials.py
│   │   │   ├── jobs.py
│   │   │   ├── certificates.py
│   │   │   ├── inquiries.py
│   │   │   ├── settings.py
│   │   │   ├── upload.py
│   │   │   ├── chatbot.py
│   │   │   └── dashboard.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── cloudinary_service.py
│   │   │   └── email_service.py
│   │   └── core/
│   │       ├── config.py
│   │       ├── security.py
│   │       └── cors.py
│   ├── alembic/
│   │   ├── versions/
│   │   ├── env.py
│   │   └── alembic.ini
│   ├── .env
│   ├── requirements.txt
│   └── README.md
│
├── PROJECT.md  ← YOU ARE HERE
├── .gitignore
└── README.md
```

---

## 🔐 Environment Variables

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=https://api.wellmangroup.in/v1
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Backend `.env`
```
DATABASE_URL=postgresql://user:pass@localhost/wellman_db
JWT_SECRET=your_super_secret_key
JWT_EXPIRE_MINUTES=1440
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CHATBOT_API_URL=http://localhost:8001
CORS_ORIGINS=["https://wellmangroup.in","http://localhost:3000"]
```

---

## 📊 Progress Tracker

### 🔧 Setup
- [ ] GitHub private repo created
- [ ] Folder structure initialized
- [ ] Frontend: Next.js 14 project created (with TypeScript + Tailwind)
- [ ] Frontend: shadcn/ui installed and configured
- [ ] Backend: FastAPI project created
- [ ] Backend: Virtual environment setup
- [ ] Backend: requirements.txt created
- [ ] Backend: PostgreSQL database created
- [ ] Backend: Alembic initialized
- [ ] Cloudinary account setup
- [ ] `.env` files created (both frontend + backend)

### 🗄️ Backend — Models
- [ ] admin_user.py
- [ ] hero_slide.py
- [ ] service.py + service_images + service_features
- [ ] project.py + project_images
- [ ] team.py
- [ ] client.py
- [ ] testimonial.py
- [ ] job.py + job_applications
- [ ] certificate.py
- [ ] inquiry.py
- [ ] site_settings.py
- [ ] First Alembic migration run ✅

### 🗄️ Backend — Schemas (Pydantic)
- [ ] auth.py
- [ ] hero_slide.py
- [ ] service.py
- [ ] project.py
- [ ] team.py
- [ ] client.py
- [ ] testimonial.py
- [ ] job.py
- [ ] certificate.py
- [ ] inquiry.py
- [ ] site_settings.py
- [ ] dashboard.py

### 🗄️ Backend — Routers (API Endpoints)
- [ ] auth.py (login, logout, refresh, change-password, me)
- [ ] hero_slides.py
- [ ] services.py (public + admin + images + features)
- [ ] projects.py (public + admin + images)
- [ ] team.py
- [ ] clients.py
- [ ] testimonials.py
- [ ] jobs.py (public + admin + applications)
- [ ] certificates.py
- [ ] inquiries.py
- [ ] settings.py
- [ ] upload.py (Cloudinary)
- [ ] chatbot.py (proxy)
- [ ] dashboard.py

### 🗄️ Backend — Services Layer
- [ ] auth_service.py (JWT + password hashing)
- [ ] cloudinary_service.py
- [ ] email_service.py

### 🗄️ Backend — Core
- [ ] config.py (pydantic settings)
- [ ] security.py
- [ ] cors.py
- [ ] main.py (app entry, all routers registered)
- [ ] database.py (connection + session)
- [ ] dependencies.py (get_db, get_current_admin)

### 🎨 Frontend — Setup
- [ ] TypeScript interfaces (all types/)
- [ ] lib/api.ts (axios instance)
- [ ] lib/auth.ts (JWT helpers)
- [ ] lib/utils.ts
- [ ] hooks/useAuth.ts
- [ ] hooks/useToast.ts
- [ ] middleware.ts (admin route protection)

### 🎨 Frontend — Layout Components
- [ ] Navbar.tsx
- [ ] Footer.tsx
- [ ] WhatsAppButton.tsx
- [ ] ChatbotWidget.tsx
- [ ] root layout.tsx

### 🎨 Frontend — Admin Panel
- [ ] admin/login/page.tsx
- [ ] admin/layout.tsx (Sidebar + Topbar)
- [ ] admin/page.tsx (Dashboard)
- [ ] Sidebar.tsx
- [ ] Topbar.tsx
- [ ] DataTable.tsx (reusable)
- [ ] ImageUpload.tsx (reusable)
- [ ] ConfirmDialog.tsx (reusable)
- [ ] admin/hero-slides/page.tsx
- [ ] admin/services/page.tsx + [id]/page.tsx
- [ ] admin/projects/page.tsx + [id]/page.tsx
- [ ] admin/team/page.tsx
- [ ] admin/clients/page.tsx
- [ ] admin/testimonials/page.tsx
- [ ] admin/jobs/page.tsx + [id]/page.tsx
- [ ] admin/certificates/page.tsx
- [ ] admin/inquiries/page.tsx
- [ ] admin/settings/page.tsx

### 🎨 Frontend — Home Page Components
- [ ] HeroSlider.tsx
- [ ] StatsSection.tsx
- [ ] AboutSnippet.tsx
- [ ] ServicesOverview.tsx
- [ ] FeaturedProjects.tsx
- [ ] ClientLogos.tsx
- [ ] Testimonials.tsx
- [ ] home page.tsx (assembles all above)

### 🎨 Frontend — Public Pages
- [ ] about/page.tsx
- [ ] services/page.tsx + ServiceCard.tsx
- [ ] services/[slug]/page.tsx + ServiceDetail.tsx
- [ ] projects/page.tsx + ProjectCard.tsx + ProjectFilter.tsx
- [ ] projects/[slug]/page.tsx + ProjectGallery.tsx
- [ ] clients/page.tsx
- [ ] career/page.tsx + JobCard.tsx
- [ ] career/[id]/page.tsx + ApplyForm.tsx
- [ ] certificates/page.tsx
- [ ] contact/page.tsx + ContactForm.tsx

### 🚀 Deployment
- [ ] Hostinger VPS purchased and provisioned
- [ ] Nginx installed and configured
- [ ] PostgreSQL installed on VPS
- [ ] PM2 installed
- [ ] Backend deployed (Uvicorn + PM2)
- [ ] Frontend deployed (Next.js build + PM2)
- [ ] SSL certificate (Let's Encrypt)
- [ ] DNS pointed to VPS
- [ ] dev.wellmangroup.in staging setup
- [ ] wellmangroup.in go-live ✅

---

## 📅 Current Status

```
Last worked on   : (update this every session)
Currently on     : Planning Phase Complete
Next step        : Backend Setup
                   1. Create GitHub repo
                   2. Initialize folder structure
                   3. Create Next.js app inside /frontend
                   4. Create FastAPI app inside /backend
                   5. Setup PostgreSQL
                   6. Setup Alembic
```

---

## 📝 Decisions Log

| Decision | Choice | Reason |
|---|---|---|
| Frontend framework | Next.js 14 (App Router) | SSR for SEO, React ecosystem, modern |
| Backend framework | FastAPI | Developer knows it, async, auto docs, Python AI ecosystem |
| Why not Django | Skipped | FastAPI better for API-first + AI integration |
| CMS approach | Custom admin in Next.js | Full control, no external dependency |
| Database | PostgreSQL | Production grade, relational, works well with SQLAlchemy |
| Image storage | Cloudinary | CDN, transforms, free tier enough |
| Auth | JWT | Simple, stateless, sufficient for single admin |
| Hosting | Hostinger VPS | Same provider as current site, full control |
| Chatbot | Separate RAG service | Already built, plug in via proxy endpoint |
| CSS | Tailwind + shadcn/ui | Fast development, consistent design system |

---

## 🐛 Known Issues / Blockers

```
- Hostinger VPS not yet purchased (need Prithvi bhai to upgrade plan)
- Cloudinary account not yet created
- GitHub repo not yet created
- Chatbot deployment location not yet decided (local → needs hosting decision)
```

---

## 📞 Project Info

```
Company         : Wellman Group
Address (Unit)  : 50,51,88 Parishram Industrial Hub, Vasna Chacharwadi,
                  Sarkhej-Bavla Highway, Changodar, Ahmedabad 382213
Address (Office): B-414, WTT (World Trade Tower), Nr. Sarkhej-Sanand Cross Road,
                  Makrba, Off S.G. Highway, Ahmedabad
Phone           : +91 94094 28888
Email           : info@wellmangroup.in
WhatsApp        : +91 94094 28888
Experience      : 12+ years
Hospital clients: 185+
Cities          : 45+
Services        : MOT, MGPS (OxyMac™), HVAC/Cleanroom, Clean Room,
                  Laminar Air Flow, ICU, NICU, IVF Lab
```

---
## Development Workflow

ChatGPT Role:

* Product Owner
* System Architect
* Code Reviewer
* Sprint Planner

Claude Code Role:

* Code Generation
* Refactoring
* File Creation
* Test Generation

Workflow:

1. Plan with ChatGPT
2. Generate with Claude
3. Review with ChatGPT
4. Commit to Git
5. Update PROJECT.md


> **How to use this file in a new chat:**
> Paste this entire file and say:
> *"This is my PROJECT.md. We left off at [current step]. Continue from here."*
> The AI will have full context and zero hallucination. ✅