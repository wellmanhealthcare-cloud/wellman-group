from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.models.certificate import Certificate
from app.schemas.certificate import (
    CertificateCreate,
    CertificateResponse,
    CertificateReorder,
    CertificateUpdate,
)

public_router = APIRouter(prefix="/certificates", tags=["Certificates"])
admin_router = APIRouter(prefix="/admin/certificates", tags=["Certificates — Admin"])


# ── Public ─────────────────────────────────────────────────────────────────────

@public_router.get("", response_model=list[CertificateResponse])
def list_certificates(db: Session = Depends(get_db)):
    return (
        db.query(Certificate)
        .filter(Certificate.is_active.is_(True))
        .order_by(Certificate.order_index)
        .all()
    )


# ── Admin ──────────────────────────────────────────────────────────────────────

@admin_router.get("", response_model=list[CertificateResponse])
def admin_list_certificates(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    return db.query(Certificate).order_by(Certificate.order_index).all()


@admin_router.post("", response_model=CertificateResponse, status_code=status.HTTP_201_CREATED)
def create_certificate(
    body: CertificateCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    cert = Certificate(**body.model_dump())
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert


@admin_router.patch("/reorder", response_model=list[CertificateResponse])
def reorder_certificates(
    body: CertificateReorder,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    for item in body.items:
        cert = db.query(Certificate).filter(Certificate.id == item.id).first()
        if not cert:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Certificate {item.id} not found",
            )
        cert.order_index = item.order_index
    db.commit()
    return db.query(Certificate).order_by(Certificate.order_index).all()


@admin_router.put("/{cert_id}", response_model=CertificateResponse)
def update_certificate(
    cert_id: UUID,
    body: CertificateUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    cert = db.query(Certificate).filter(Certificate.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certificate not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(cert, field, value)
    db.commit()
    db.refresh(cert)
    return cert


@admin_router.delete("/{cert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_certificate(
    cert_id: UUID,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    cert = db.query(Certificate).filter(Certificate.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certificate not found")
    db.delete(cert)
    db.commit()
