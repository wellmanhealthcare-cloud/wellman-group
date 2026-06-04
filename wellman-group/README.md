# Wellman Group CMS

Complete rebuild of wellmangroup.in — modern stack with CMS, chatbot, and WhatsApp integration.

**Status:** Project initialization phase  
**Tech Stack:** Next.js 14 + FastAPI + PostgreSQL  
**Live Site:** https://wellmangroup.in

---

## Project Structure

```
wellman-group/
├── frontend/          # Next.js 14 app
├── backend/           # FastAPI + SQLAlchemy
├── PROJECT.md         # Source of truth
└── README.md          # This file
```

---

## Setup Instructions

### Prerequisites

- **Node.js 18+** (for frontend)
- **Python 3.11+** (for backend)
- **PostgreSQL 15+** (for database)
- **Git** (version control)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`

---

## Documentation

- **PROJECT.md** — Complete project specification (locked scope, tech stack, database schema, API routes)
- **ARCHITECTURE_REVIEW.md** — Backend architecture review, gaps, security concerns, sprint plan

---

## Team

- **Client:** Wellman Group (Prithvi Solanki, Managing Director)
- **Developer:** Prithvi's nephew (AI Engineer + Full Stack Developer)

---

## Quick Links

- [Project Specification](./PROJECT.md)
- [Architecture Review](./ARCHITECTURE_REVIEW.md)
- Frontend Docs: `frontend/README.md`
- Backend Docs: `backend/README.md`

---

**Last updated:** 2026-06-04  
**Next phase:** Backend models + API implementation
