# AI_CONTEXT.md

## Project

Wellman Group Website + Admin Panel

Tech Stack:

* Frontend: Next.js 14 + TypeScript + Tailwind
* Backend: FastAPI
* Database: PostgreSQL
* ORM: SQLAlchemy 2.0
* Migrations: Alembic
* Authentication: JWT
* File Storage: Cloudinary

## Repository Structure

frontend/
backend/

## Completed Sprints

Sprint 1 - Project Setup
Sprint 2 - Backend Foundation
Sprint 3 - SQLAlchemy Models
Sprint 4 - PostgreSQL + Alembic
Sprint 5 - Pydantic Schemas
Sprint 6 - Authentication Service
Sprint 7 - Authentication Router
Sprint 8 - Cloudinary Upload Service

## Current Status

Authentication:

* Login implemented
* Me endpoint implemented
* Change password implemented
* Logout implemented

Uploads:

* Cloudinary service implemented
* Upload router implemented

Database:

* PostgreSQL configured
* Alembic configured
* Initial migrations completed

## Audit Findings

Pending Fixes:

1. HeroSlide.subheading schema should be Optional
2. TeamMember.bio schema should be Optional
3. TeamMember.photo_url schema should be Optional
4. Testimonial.photo_url schema should be Optional

Recommended Future Fix:

* Restore FK indexes dropped by migration

## Development Rules

* One sprint at a time
* No refactoring completed sprints unless fixing a bug
* Only modify files listed in the sprint scope
* Generate SPRINT_REPORT.md after every sprint

## Current Sprint

Sprint 8.1
Schema Consistency Fix

## Next Planned Sprint

Sprint 9
Hero Slides CRUD

## Important Files

PROJECT.md
CURRENT_SPRINT.md
TASK_STATUS.md
CHANGELOG.md
PROJECT_AUDIT.md
SPRINT_REPORT.md

Read these before writing code.
