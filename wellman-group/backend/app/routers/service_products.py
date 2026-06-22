from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.models.service_product import ServiceProduct
from app.schemas.service_product import (
    ServiceProductCreate,
    ServiceProductResponse,
    ServiceProductUpdate,
)

public_router = APIRouter(prefix="/products", tags=["Product Items"])
admin_router = APIRouter(prefix="/admin/product-items", tags=["Product Items — Admin"])


# ── Public ─────────────────────────────────────────────────────────────────────

@public_router.get("/{product_slug}/items", response_model=list[ServiceProductResponse])
def list_product_items(product_slug: str, db: Session = Depends(get_db)):
    return (
        db.query(ServiceProduct)
        .filter(ServiceProduct.service_slug == product_slug, ServiceProduct.is_active.is_(True))
        .order_by(ServiceProduct.order_index)
        .all()
    )


# ── Admin ──────────────────────────────────────────────────────────────────────

@admin_router.get("", response_model=list[ServiceProductResponse])
def admin_list(
    product_slug: str | None = None,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    q = db.query(ServiceProduct)
    if product_slug:
        q = q.filter(ServiceProduct.service_slug == product_slug)
    return q.order_by(ServiceProduct.service_slug, ServiceProduct.order_index).all()


@admin_router.post("", response_model=ServiceProductResponse, status_code=status.HTTP_201_CREATED)
def create(
    body: ServiceProductCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    product = ServiceProduct(**body.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@admin_router.put("/{product_id}", response_model=ServiceProductResponse)
def update(
    product_id: UUID,
    body: ServiceProductUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    product = db.query(ServiceProduct).filter(ServiceProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


@admin_router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(
    product_id: UUID,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    product = db.query(ServiceProduct).filter(ServiceProduct.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    db.delete(product)
    db.commit()
