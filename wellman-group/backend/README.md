# Wellman Group Backend

FastAPI backend for the Wellman Group CMS — complete medical facility management system.

## Stack

- **Framework:** FastAPI 0.104.1
- **ORM:** SQLAlchemy 2.0
- **Migrations:** Alembic
- **Database:** PostgreSQL 15+
- **Auth:** JWT (single admin user)
- **File Storage:** Cloudinary
- **Server:** Uvicorn

## Project Structure

```
app/
├── main.py              # App entry point
├── database.py          # Database configuration
├── dependencies.py      # Dependency injection
├── models/              # SQLAlchemy models (15 tables)
├── schemas/             # Pydantic validation schemas
├── routers/             # API route handlers (23 endpoints)
├── services/            # Business logic layer
│   ├── auth_service.py
│   ├── cloudinary_service.py
│   └── email_service.py
└── core/                # Configuration & security
    ├── config.py
    ├── security.py
    └── cors.py

alembic/                # Database migrations
requirements.txt        # Python dependencies
.env                    # Environment variables
```

## Setup

### 1. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update:

```bash
DATABASE_URL=postgresql://user:password@localhost/wellman_db
JWT_SECRET=your_super_secret_key_here_change_in_production
JWT_EXPIRE_MINUTES=1440
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CHATBOT_API_URL=http://localhost:8001
CORS_ORIGINS=["https://wellmangroup.in","http://localhost:3000"]
```

### 4. Initialize Database

```bash
# Create PostgreSQL database
createdb wellman_db

# Run Alembic migrations
alembic upgrade head
```

### 5. Run Development Server

```bash
uvicorn app.main:app --reload
```

Server runs at `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

## API Routes

**Base URL:** `/api/v1`

- **Auth:** `/auth/login`, `/auth/logout`, `/auth/refresh`, `/auth/me`
- **Services:** `/services`, `/admin/services`
- **Projects:** `/projects`, `/admin/projects`
- **Team:** `/team`, `/admin/team`
- **Clients:** `/clients`, `/admin/clients`
- **Jobs:** `/jobs`, `/admin/jobs`
- **Testimonials:** `/testimonials`, `/admin/testimonials`
- **Hero Slides:** `/hero-slides`, `/admin/hero-slides`
- **Certificates:** `/certificates`, `/admin/certificates`
- **Inquiries:** `/inquiries`, `/admin/inquiries`
- **Settings:** `/settings`, `/admin/settings`
- **Upload:** `/admin/upload/image`, `/admin/upload/pdf`
- **Chatbot:** `/chat`
- **Dashboard:** `/admin/dashboard`

See PROJECT.md for complete API specification.

## Development

### Code Style

- PEP 8 compliant
- Type hints required
- Docstrings for all public functions
- No hardcoded secrets

### Testing

```bash
pytest
```

### Database Migrations

Create new migration after model changes:

```bash
alembic revision --autogenerate -m "describe changes"
alembic upgrade head
```

## Dependencies

See `requirements.txt` for full list. Core packages:

- `fastapi` — Modern async web framework
- `sqlalchemy` — SQL toolkit & ORM
- `alembic` — Database migration tool
- `psycopg2-binary` — PostgreSQL driver
- `pydantic` — Data validation
- `pyjwt` — JWT authentication
- `cloudinary` — File storage & CDN
- `python-dotenv` — Environment variables

## Troubleshooting

**Connection refused:** Ensure PostgreSQL is running locally or DATABASE_URL points to correct server

**Import errors:** Verify virtual environment is activated (`source venv/bin/activate`)

**Permission denied:** Check JWT_SECRET is set in .env

---

**Status:** Foundation complete — ready for models phase  
**Next Step:** Create SQLAlchemy models
