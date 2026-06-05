from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import text

from app.core.config import settings
from app.core.cors import setup_cors
from app.database import engine
from app.routers import (
    auth,
    certificates,
    chatbot,
    clients,
    dashboard,
    hero_slides,
    inquiries,
    jobs,
    projects,
    services,
    settings as settings_router,
    team,
    testimonials,
    upload,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    yield
    engine.dispose()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url=f"{settings.API_V1_PREFIX}/docs",
    redoc_url=f"{settings.API_V1_PREFIX}/redoc",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    lifespan=lifespan,
)

setup_cors(app)

app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(hero_slides.router, prefix=settings.API_V1_PREFIX)
app.include_router(services.router, prefix=settings.API_V1_PREFIX)
app.include_router(projects.public_router, prefix=settings.API_V1_PREFIX)
app.include_router(projects.admin_router, prefix=settings.API_V1_PREFIX)
app.include_router(team.public_router, prefix=settings.API_V1_PREFIX)
app.include_router(team.admin_router, prefix=settings.API_V1_PREFIX)
app.include_router(clients.public_router, prefix=settings.API_V1_PREFIX)
app.include_router(clients.admin_router, prefix=settings.API_V1_PREFIX)
app.include_router(testimonials.public_router, prefix=settings.API_V1_PREFIX)
app.include_router(testimonials.admin_router, prefix=settings.API_V1_PREFIX)
app.include_router(jobs.public_router, prefix=settings.API_V1_PREFIX)
app.include_router(jobs.admin_jobs_router, prefix=settings.API_V1_PREFIX)
app.include_router(jobs.admin_applications_router, prefix=settings.API_V1_PREFIX)
app.include_router(certificates.public_router, prefix=settings.API_V1_PREFIX)
app.include_router(certificates.admin_router, prefix=settings.API_V1_PREFIX)
app.include_router(inquiries.public_router, prefix=settings.API_V1_PREFIX)
app.include_router(inquiries.admin_router, prefix=settings.API_V1_PREFIX)
app.include_router(settings_router.public_router, prefix=settings.API_V1_PREFIX)
app.include_router(settings_router.admin_router, prefix=settings.API_V1_PREFIX)
app.include_router(dashboard.router, prefix=settings.API_V1_PREFIX)
app.include_router(chatbot.router, prefix=settings.API_V1_PREFIX)
app.include_router(upload.router, prefix=settings.API_V1_PREFIX)


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok", "version": settings.APP_VERSION}


@app.get(f"{settings.API_V1_PREFIX}/health", tags=["Health"])
def health_v1():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        db_status = "disconnected"

    return {
        "status": "ok",
        "version": settings.APP_VERSION,
        "database": db_status,
    }
