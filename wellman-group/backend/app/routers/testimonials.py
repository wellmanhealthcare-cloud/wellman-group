from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.models.testimonial import Testimonial
from app.schemas.testimonial import (
    TestimonialCreate,
    TestimonialResponse,
    TestimonialReorder,
    TestimonialUpdate,
)

public_router = APIRouter(prefix="/testimonials", tags=["Testimonials"])
admin_router = APIRouter(prefix="/admin/testimonials", tags=["Testimonials — Admin"])


# ── Public ─────────────────────────────────────────────────────────────────────

@public_router.get("", response_model=list[TestimonialResponse])
def list_testimonials(db: Session = Depends(get_db)):
    return (
        db.query(Testimonial)
        .filter(Testimonial.is_active.is_(True))
        .order_by(Testimonial.order_index)
        .all()
    )


# ── Admin ──────────────────────────────────────────────────────────────────────

@admin_router.get("", response_model=list[TestimonialResponse])
def admin_list_testimonials(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    return db.query(Testimonial).order_by(Testimonial.order_index).all()


@admin_router.post("", response_model=TestimonialResponse, status_code=status.HTTP_201_CREATED)
def create_testimonial(
    body: TestimonialCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    testimonial = Testimonial(**body.model_dump())
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return testimonial


@admin_router.patch("/reorder", response_model=list[TestimonialResponse])
def reorder_testimonials(
    body: TestimonialReorder,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    for item in body.items:
        testimonial = db.query(Testimonial).filter(Testimonial.id == item.id).first()
        if not testimonial:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Testimonial {item.id} not found",
            )
        testimonial.order_index = item.order_index
    db.commit()
    return db.query(Testimonial).order_by(Testimonial.order_index).all()


@admin_router.put("/{testimonial_id}", response_model=TestimonialResponse)
def update_testimonial(
    testimonial_id: UUID,
    body: TestimonialUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(testimonial, field, value)
    db.commit()
    db.refresh(testimonial)
    return testimonial


@admin_router.delete("/{testimonial_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_testimonial(
    testimonial_id: UUID,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")
    db.delete(testimonial)
    db.commit()
