from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.limiter import limiter
from app.dependencies import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.models.inquiry import Inquiry
from app.schemas.inquiry import InquiryCreate, InquiryMarkRead, InquiryResponse

public_router = APIRouter(prefix="/inquiries", tags=["Inquiries"])
admin_router = APIRouter(prefix="/admin/inquiries", tags=["Inquiries — Admin"])


# ── Public ─────────────────────────────────────────────────────────────────────

@public_router.post("", response_model=InquiryResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
def submit_inquiry(request: Request, body: InquiryCreate, db: Session = Depends(get_db)):
    inquiry = Inquiry(**body.model_dump())
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry


# ── Admin ──────────────────────────────────────────────────────────────────────

@admin_router.get("", response_model=list[InquiryResponse])
def list_inquiries(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    return (
        db.query(Inquiry)
        .order_by(Inquiry.created_at.desc())
        .all()
    )


# Sub-paths declared before /{inquiry_id} to avoid routing ambiguity
@admin_router.patch("/{inquiry_id}/read", response_model=InquiryResponse)
def mark_inquiry_read(
    inquiry_id: UUID,
    body: InquiryMarkRead,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found")
    inquiry.is_read = body.is_read
    db.commit()
    db.refresh(inquiry)
    return inquiry


@admin_router.get("/{inquiry_id}", response_model=InquiryResponse)
def get_inquiry(
    inquiry_id: UUID,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found")
    return inquiry


@admin_router.delete("/{inquiry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inquiry(
    inquiry_id: UUID,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found")
    db.delete(inquiry)
    db.commit()
