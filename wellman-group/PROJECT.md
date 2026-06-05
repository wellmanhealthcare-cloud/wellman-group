# Wellman Group — Project Bible
> Paste this into every new AI session. This file never changes — it is the locked spec.

---

## 🧠 Project Context

**Client:** Wellman Group
**Managing Director:** Prithvi Solanki
**Developer:** Prithvi's nephew (AI Engineer + Full Stack Developer)
**Current site:** https://wellmangroup.in (PHP + jQuery on Hostinger Shared Hosting)
**Goal:** Complete rebuild — modern stack, custom CMS, chatbot, WhatsApp integration
**Domain:** wellmangroup.in (same domain, DNS pointed to new VPS)

---

## ✅ Tech Stack (Locked)

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| HTTP Client | Axios |
| Backend | FastAPI |
| ORM | SQLAlchemy 2.0 |
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
│   └── /projects/[slug]
│
├── /clients
│
├── /career
│   ├── /career/[id]
│   └── Apply form
│
├── /certificates
│
├── /contact
│   ├── Inquiry form
│   ├── WhatsApp link
│   ├── Address + Google Map
│   └── Social links
│
└── /admin (JWT protected)
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

## 🗄️ Database Schema (Locked — 15 tables)

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
subheading      VARCHAR     NULLABLE
cta_text        VARCHAR
cta_link        VARCHAR
order_index     INTEGER
is_active       BOOLEAN     DEFAULT true
```

### 15. `site_settings`
```sql
id              UUID        PRIMARY KEY   (single row)
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
PUT    /auth/change-password
GET    /auth/me
```

### Hero Slides
```
GET    /hero-slides
POST   /hero-slides
PUT    /hero-slides/{id}
DELETE /hero-slides/{id}
```

### Services
```
GET    /services
GET    /services/{slug}
POST   /services
PUT    /services/{id}
DELETE /services/{id}
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
│   │   │       ├── login/page.tsx
│   │   │       ├── page.tsx (dashboard)
│   │   │       ├── hero-slides/page.tsx
│   │   │       ├── services/page.tsx + [id]/page.tsx
│   │   │       ├── projects/page.tsx + [id]/page.tsx
│   │   │       ├── team/page.tsx
│   │   │       ├── clients/page.tsx
│   │   │       ├── testimonials/page.tsx
│   │   │       ├── jobs/page.tsx + [id]/page.tsx
│   │   │       ├── certificates/page.tsx
│   │   │       ├── inquiries/page.tsx
│   │   │       └── settings/page.tsx
│   │   ├── components/
│   │   │   ├── ui/           (shadcn)
│   │   │   ├── layout/       (Navbar, Footer, WhatsAppButton, ChatbotWidget)
│   │   │   ├── home/         (HeroSlider, StatsSection, ServicesOverview, etc.)
│   │   │   ├── services/     (ServiceCard, ServiceDetail)
│   │   │   ├── projects/     (ProjectCard, ProjectFilter, ProjectGallery)
│   │   │   ├── career/       (JobCard, ApplyForm)
│   │   │   ├── contact/      (ContactForm)
│   │   │   └── admin/        (Sidebar, Topbar, DataTable, ImageUpload, ConfirmDialog)
│   │   ├── lib/              (api.ts, auth.ts, utils.ts)
│   │   ├── hooks/            (useAuth.ts, useToast.ts)
│   │   ├── types/            (service.ts, project.ts, team.ts, etc.)
│   │   └── middleware.ts
│   ├── .env.local
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── models/           (admin_user, service, project, team, client,
│   │   │                      testimonial, job, certificate, inquiry,
│   │   │                      hero_slide, site_settings)
│   │   ├── schemas/          (same names as models + dashboard)
│   │   ├── routers/          (auth, hero_slides, services, projects, team,
│   │   │                      clients, testimonials, jobs, certificates,
│   │   │                      inquiries, settings, upload, chatbot, dashboard)
│   │   ├── services/         (auth_service, cloudinary_service, email_service)
│   │   └── core/             (config, security, cors)
│   ├── scripts/
│   │   └── create_admin.py
│   ├── alembic/
│   ├── .env
│   └── requirements.txt
│
├── PROJECT.md   ← static spec (this file)
├── STATUS.md    ← living state (update every sprint)
└── .gitignore
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
JWT_SECRET=your_super_secret_key        ← replace before production
JWT_EXPIRE_MINUTES=1440
CLOUDINARY_CLOUD_NAME=your_cloud_name   ← replace with real credentials
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CHATBOT_API_URL=http://localhost:8001
CORS_ORIGINS=["https://wellmangroup.in","http://localhost:3000"]
```

---

## 📞 Company Info

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

## 📝 Decisions Log

| Decision | Choice | Reason |
|---|---|---|
| Frontend | Next.js 14 App Router | SSR for SEO, modern React ecosystem |
| Backend | FastAPI | Python, async, auto docs, AI ecosystem |
| CMS | Custom admin in Next.js | Full control, no external dependency |
| Database | PostgreSQL | Production grade, relational |
| Images | Cloudinary | CDN, transforms, free tier sufficient |
| Auth | JWT | Stateless, simple, single admin |
| Hosting | Hostinger VPS | Same provider, full control |
| Chatbot | Separate RAG service | Already built, plug in via proxy |
| CSS | Tailwind + shadcn/ui | Fast dev, consistent design system |

---

## ⚙️ Development Workflow

- **Plan** with ChatGPT (Product Owner / Architect)
- **Generate** with Claude Code (Code generation / File creation)
- **Review** with ChatGPT
- **Commit** to Git
- **Update** STATUS.md

### Rules
- One sprint at a time
- Never modify completed sprint files unless fixing a bug
- Only touch files listed in the sprint scope
- Update STATUS.md after every sprint
