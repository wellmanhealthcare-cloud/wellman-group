from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.models.job import JobApplication, JobOpening
from app.schemas.job import (
    JobApplicationCreate,
    JobApplicationResponse,
    JobOpeningCreate,
    JobOpeningListResponse,
    JobOpeningResponse,
    JobOpeningToggle,
    JobOpeningUpdate,
)

public_router = APIRouter(prefix="/jobs", tags=["Jobs"])
admin_jobs_router = APIRouter(prefix="/admin/jobs", tags=["Jobs — Admin"])
admin_applications_router = APIRouter(prefix="/admin/applications", tags=["Applications — Admin"])


# ── Public ─────────────────────────────────────────────────────────────────────

@public_router.get("", response_model=list[JobOpeningListResponse])
def list_jobs(db: Session = Depends(get_db)):
    return (
        db.query(JobOpening)
        .filter(JobOpening.is_open.is_(True))
        .order_by(JobOpening.created_at.desc())
        .all()
    )


@public_router.get("/{job_id}", response_model=JobOpeningListResponse)
def get_job(job_id: UUID, db: Session = Depends(get_db)):
    job = (
        db.query(JobOpening)
        .filter(JobOpening.id == job_id, JobOpening.is_open.is_(True))
        .first()
    )
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job


@public_router.post(
    "/{job_id}/apply",
    response_model=JobApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def apply_for_job(
    job_id: UUID,
    body: JobApplicationCreate,
    db: Session = Depends(get_db),
):
    job = (
        db.query(JobOpening)
        .filter(JobOpening.id == job_id, JobOpening.is_open.is_(True))
        .first()
    )
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found or no longer accepting applications",
        )
    application = JobApplication(job_id=job_id, **body.model_dump())
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


# ── Admin — Jobs ───────────────────────────────────────────────────────────────

@admin_jobs_router.get("", response_model=list[JobOpeningListResponse])
def admin_list_jobs(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    return db.query(JobOpening).order_by(JobOpening.created_at.desc()).all()


@admin_jobs_router.post("", response_model=JobOpeningResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    body: JobOpeningCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    job = JobOpening(**body.model_dump())
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


# Sub-paths declared before /{job_id} to avoid routing ambiguity
@admin_jobs_router.get("/{job_id}/applications", response_model=list[JobApplicationResponse])
def get_job_applications(
    job_id: UUID,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    if not db.query(JobOpening).filter(JobOpening.id == job_id).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return (
        db.query(JobApplication)
        .filter(JobApplication.job_id == job_id)
        .order_by(JobApplication.applied_at.desc())
        .all()
    )


@admin_jobs_router.patch("/{job_id}/toggle", response_model=JobOpeningListResponse)
def toggle_job(
    job_id: UUID,
    body: JobOpeningToggle,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    job = db.query(JobOpening).filter(JobOpening.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    job.is_open = body.is_open
    db.commit()
    db.refresh(job)
    return job


@admin_jobs_router.put("/{job_id}", response_model=JobOpeningResponse)
def update_job(
    job_id: UUID,
    body: JobOpeningUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    job = db.query(JobOpening).filter(JobOpening.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(job, field, value)
    db.commit()
    db.refresh(job)
    return job


@admin_jobs_router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: UUID,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    job = db.query(JobOpening).filter(JobOpening.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    db.delete(job)
    db.commit()


# ── Admin — Applications ───────────────────────────────────────────────────────

@admin_applications_router.get("", response_model=list[JobApplicationResponse])
def list_all_applications(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    return (
        db.query(JobApplication)
        .order_by(JobApplication.applied_at.desc())
        .all()
    )


@admin_applications_router.patch("/{app_id}/read", response_model=JobApplicationResponse)
def mark_as_read(
    app_id: UUID,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    application = db.query(JobApplication).filter(JobApplication.id == app_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    application.is_read = True
    db.commit()
    db.refresh(application)
    return application


@admin_applications_router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(
    app_id: UUID,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    application = db.query(JobApplication).filter(JobApplication.id == app_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    db.delete(application)
    db.commit()
