# Alembic Setup Guide

## Configuration Complete

Alembic is now configured for:
- ✅ SQLAlchemy 2.0
- ✅ PostgreSQL (with UUID support)
- ✅ Existing models in app/models/
- ✅ Automatic migration generation
- ✅ Proper foreign key ordering

## Files Created

1. **alembic.ini** — Main Alembic configuration
2. **alembic/env.py** — Environment setup with model imports
3. **alembic/script.py.mako** — Migration template
4. **alembic/versions/001_initial_migration.py** — Initial schema migration

## Setup Commands

```bash
cd backend

# Activate virtual environment
venv\Scripts\Activate.ps1    # Windows PowerShell
# or
venv\Scripts\activate.bat    # Windows Command Prompt
# or
source venv/bin/activate     # Linux/Mac

# Install dependencies (already done, but verify)
pip install -r requirements.txt

# Create PostgreSQL database (if not exists)
createdb wellman_db

# Run migrations to create all tables
alembic upgrade head
```

## What Gets Created

The migration creates **15 tables** in PostgreSQL:

### Core Entities (Standalone)
1. **admin_users** — Admin user accounts
2. **team_members** — Team members
3. **clients** — Hospital/client logos
4. **testimonials** — Client testimonials
5. **inquiries** — Contact form inquiries
6. **hero_slides** — Homepage hero slider
7. **certificates** — Certifications
8. **site_settings** — Global site configuration

### Hierarchical Entities (with relationships)
9. **services** + **service_images** + **service_features** — Medical services
10. **projects** + **project_images** — Project portfolio
11. **job_openings** + **job_applications** — Career portal

## Foreign Key Relationships

```
Services
  ├── ServiceImages (1:N)
  ├── ServiceFeatures (1:N)
  └── Projects (1:N)

Projects
  └── ProjectImages (1:N)

JobOpenings
  └── JobApplications (1:N)
```

All foreign keys use **CASCADE DELETE** for data integrity.

## Migration Order (Enforced)

1. Independent tables first: admin_users, team_members, clients, testimonials, inquiries, hero_slides, certificates, site_settings
2. Parent tables: services, job_openings
3. Related tables: service_images, service_features, projects, job_applications
4. Child tables: project_images

This order ensures no foreign key constraint violations during creation.

## Verify Migration

After running `alembic upgrade head`, connect to PostgreSQL:

```bash
psql wellman_db

# List all tables
\dt

# View admin_users schema
\d admin_users

# Check service relationships
\d services

# Exit
\q
```

Expected output: 15 tables with proper columns and constraints.

## Rollback (if needed)

```bash
# Downgrade to previous version
alembic downgrade -1

# Downgrade to base (remove all tables)
alembic downgrade base
```

## Create Future Migrations

After modifying models:

```bash
# Generate migration from model changes
alembic revision --autogenerate -m "describe your changes"

# Review the generated migration file
cat alembic/versions/002_*.py

# Apply the migration
alembic upgrade head
```

---

**Status:** ✅ Alembic configured and ready for database creation
