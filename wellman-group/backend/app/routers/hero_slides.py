from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.models.hero_slide import HeroSlide
from app.schemas.hero_slide import HeroSlideCreate, HeroSlideResponse, HeroSlideUpdate

public_router = APIRouter(prefix="/hero-slides", tags=["Hero Slides"])
admin_router = APIRouter(prefix="/admin/hero-slides", tags=["Hero Slides — Admin"])


# ── Public ─────────────────────────────────────────────────────────────────────

@public_router.get("", response_model=list[HeroSlideResponse])
def list_slides(db: Session = Depends(get_db)):
    return (
        db.query(HeroSlide)
        .filter(HeroSlide.is_active.is_(True))
        .order_by(HeroSlide.order_index)
        .all()
    )


@public_router.get("/{slide_id}", response_model=HeroSlideResponse)
def get_slide(slide_id: UUID, db: Session = Depends(get_db)):
    slide = db.query(HeroSlide).filter(HeroSlide.id == slide_id).first()
    if not slide:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slide not found")
    return slide


# ── Admin ──────────────────────────────────────────────────────────────────────

@admin_router.post("", response_model=HeroSlideResponse, status_code=status.HTTP_201_CREATED)
def create_slide(
    body: HeroSlideCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    slide = HeroSlide(**body.model_dump())
    db.add(slide)
    db.commit()
    db.refresh(slide)
    return slide


@admin_router.put("/{slide_id}", response_model=HeroSlideResponse)
def update_slide(
    slide_id: UUID,
    body: HeroSlideUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    slide = db.query(HeroSlide).filter(HeroSlide.id == slide_id).first()
    if not slide:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slide not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(slide, field, value)
    db.commit()
    db.refresh(slide)
    return slide


@admin_router.delete("/{slide_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_slide(
    slide_id: UUID,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    slide = db.query(HeroSlide).filter(HeroSlide.id == slide_id).first()
    if not slide:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slide not found")
    db.delete(slide)
    db.commit()
