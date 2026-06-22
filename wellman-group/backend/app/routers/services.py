from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.models.service import Service, ServiceImage
from app.schemas.service import (
    ServiceCreate,
    ServiceImageCreate,
    ServiceImageReorder,
    ServiceImageResponse,
    ServiceListResponse,
    ServiceResponse,
    ServiceUpdate,
)

public_router = APIRouter(prefix="/products", tags=["Products"])
admin_router = APIRouter(prefix="/admin/products", tags=["Products — Admin"])


# ── Public ─────────────────────────────────────────────────────────────────────

@public_router.get("", response_model=list[ServiceListResponse])
def list_services(db: Session = Depends(get_db)):
    return (
        db.query(Service)
        .filter(Service.is_active.is_(True))
        .order_by(Service.order_index)
        .all()
    )


@public_router.get("/{slug}", response_model=ServiceResponse)
def get_service(slug: str, db: Session = Depends(get_db)):
    service = (
        db.query(Service)
        .filter(Service.slug == slug, Service.is_active.is_(True))
        .first()
    )
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return service


# ── Admin ──────────────────────────────────────────────────────────────────────

@admin_router.post("", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
def create_service(
    body: ServiceCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    existing = db.query(Service).filter(Service.slug == body.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Slug '{body.slug}' is already in use",
        )
    service = Service(**body.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@admin_router.put("/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: UUID,
    body: ServiceUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    updates = body.model_dump(exclude_unset=True)

    if "slug" in updates:
        conflict = (
            db.query(Service)
            .filter(Service.slug == updates["slug"], Service.id != service_id)
            .first()
        )
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Slug '{updates['slug']}' is already in use",
            )

    for field, value in updates.items():
        if field == "long_desc" and value is None:
            value = ""
        setattr(service, field, value)

    db.commit()
    db.refresh(service)
    return service


@admin_router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(
    service_id: UUID,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    db.delete(service)
    db.commit()


@admin_router.post(
    "/{service_id}/images",
    response_model=ServiceImageResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_image(
    service_id: UUID,
    body: ServiceImageCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    if not db.query(Service).filter(Service.id == service_id).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    image = ServiceImage(service_id=service_id, **body.model_dump())
    db.add(image)
    db.commit()
    db.refresh(image)
    return image


@admin_router.delete("/{service_id}/images/{img_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_image(
    service_id: UUID,
    img_id: UUID,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    image = (
        db.query(ServiceImage)
        .filter(ServiceImage.id == img_id, ServiceImage.service_id == service_id)
        .first()
    )
    if not image:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")
    db.delete(image)
    db.commit()


@admin_router.patch("/{service_id}/images/reorder", response_model=list[ServiceImageResponse])
def reorder_images(
    service_id: UUID,
    body: ServiceImageReorder,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    if not db.query(Service).filter(Service.id == service_id).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    for item in body.items:
        image = (
            db.query(ServiceImage)
            .filter(ServiceImage.id == item.id, ServiceImage.service_id == service_id)
            .first()
        )
        if not image:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Image {item.id} not found in this product",
            )
        image.order_index = item.order_index

    db.commit()
    return (
        db.query(ServiceImage)
        .filter(ServiceImage.service_id == service_id)
        .order_by(ServiceImage.order_index)
        .all()
    )
