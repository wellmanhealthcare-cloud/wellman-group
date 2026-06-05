from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select as sa_select
from sqlalchemy.orm import Session

from app.dependencies import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.models.project import Project, ProjectImage
from app.models.service import Service
from app.schemas.project import (
    ProjectCreate,
    ProjectFeatureToggle,
    ProjectImageCreate,
    ProjectImageReorder,
    ProjectImageResponse,
    ProjectListResponse,
    ProjectResponse,
    ProjectUpdate,
)


def _with_covers(projects: list, db: Session) -> list[ProjectListResponse]:
    """Attach cover_image_url (first image by order_index) to each project."""
    if not projects:
        return []
    ids = [p.id for p in projects]
    rows = db.execute(
        sa_select(ProjectImage.project_id, ProjectImage.image_url)
        .where(ProjectImage.project_id.in_(ids))
        .order_by(ProjectImage.project_id, ProjectImage.order_index)
    ).all()
    first: dict = {}
    for pid, url in rows:
        if pid not in first:
            first[pid] = url
    result = []
    for p in projects:
        item = ProjectListResponse.model_validate(p)
        item = item.model_copy(update={"cover_image_url": first.get(p.id)})
        result.append(item)
    return result

public_router = APIRouter(prefix="/projects", tags=["Projects"])
admin_router = APIRouter(prefix="/admin/projects", tags=["Projects — Admin"])


# ── Public ─────────────────────────────────────────────────────────────────────

@public_router.get("", response_model=list[ProjectListResponse])
def list_projects(
    service_slug: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Project).filter(Project.is_active.is_(True))
    if service_slug:
        query = (
            query
            .join(Service, Project.service_id == Service.id)
            .filter(Service.slug == service_slug)
        )
    return _with_covers(query.order_by(Project.order_index).all(), db)


@public_router.get("/{slug}", response_model=ProjectResponse)
def get_project(slug: str, db: Session = Depends(get_db)):
    project = (
        db.query(Project)
        .filter(Project.slug == slug, Project.is_active.is_(True))
        .first()
    )
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


# ── Admin ──────────────────────────────────────────────────────────────────────

@admin_router.get("", response_model=list[ProjectListResponse])
def admin_list_projects(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    return _with_covers(db.query(Project).order_by(Project.order_index).all(), db)


@admin_router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    body: ProjectCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    if db.query(Project).filter(Project.slug == body.slug).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Slug '{body.slug}' is already in use",
        )
    project = Project(**body.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@admin_router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: UUID,
    body: ProjectUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    updates = body.model_dump(exclude_unset=True)

    if "slug" in updates:
        conflict = (
            db.query(Project)
            .filter(Project.slug == updates["slug"], Project.id != project_id)
            .first()
        )
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Slug '{updates['slug']}' is already in use",
            )

    for field, value in updates.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project


@admin_router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    db.delete(project)
    db.commit()


@admin_router.patch("/{project_id}/feature", response_model=ProjectResponse)
def toggle_feature(
    project_id: UUID,
    body: ProjectFeatureToggle,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    project.is_featured = body.is_featured
    db.commit()
    db.refresh(project)
    return project


@admin_router.post(
    "/{project_id}/images",
    response_model=ProjectImageResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_image(
    project_id: UUID,
    body: ProjectImageCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    if not db.query(Project).filter(Project.id == project_id).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    image = ProjectImage(project_id=project_id, **body.model_dump())
    db.add(image)
    db.commit()
    db.refresh(image)
    return image


@admin_router.delete("/{project_id}/images/{img_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_image(
    project_id: UUID,
    img_id: UUID,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    image = (
        db.query(ProjectImage)
        .filter(ProjectImage.id == img_id, ProjectImage.project_id == project_id)
        .first()
    )
    if not image:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")
    db.delete(image)
    db.commit()


@admin_router.patch("/{project_id}/images/reorder", response_model=list[ProjectImageResponse])
def reorder_images(
    project_id: UUID,
    body: ProjectImageReorder,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    if not db.query(Project).filter(Project.id == project_id).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    for item in body.items:
        image = (
            db.query(ProjectImage)
            .filter(ProjectImage.id == item.id, ProjectImage.project_id == project_id)
            .first()
        )
        if not image:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Image {item.id} not found in this project",
            )
        image.order_index = item.order_index

    db.commit()
    return (
        db.query(ProjectImage)
        .filter(ProjectImage.project_id == project_id)
        .order_by(ProjectImage.order_index)
        .all()
    )
