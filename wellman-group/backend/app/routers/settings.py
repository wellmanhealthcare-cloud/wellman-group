from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.models.site_settings import SiteSettings
from app.schemas.site_settings import BrochureUpload, SiteSettingsResponse, SiteSettingsUpdate

public_router = APIRouter(prefix="/settings", tags=["Settings"])
admin_router = APIRouter(prefix="/admin/settings", tags=["Settings — Admin"])


# ── Public ─────────────────────────────────────────────────────────────────────

@public_router.get("", response_model=SiteSettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    row = db.query(SiteSettings).first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Settings not configured")
    return row


# ── Admin ──────────────────────────────────────────────────────────────────────

@admin_router.get("", response_model=SiteSettingsResponse)
def admin_get_settings(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    row = db.query(SiteSettings).first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Settings not configured")
    return row


@admin_router.put("", response_model=SiteSettingsResponse)
def update_settings(
    body: SiteSettingsUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    updates = body.model_dump(exclude_unset=True)
    row = db.query(SiteSettings).first()
    if row:
        for field, value in updates.items():
            setattr(row, field, value)
    else:
        row = SiteSettings(**updates)
        db.add(row)
    db.commit()
    db.refresh(row)
    return row


# /brochure declared before a potential /{id} path — safe explicit sub-route
@admin_router.post("/brochure", response_model=SiteSettingsResponse)
def update_brochure(
    body: BrochureUpload,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    row = db.query(SiteSettings).first()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Settings not configured")
    row.brochure_url = body.file_url
    db.commit()
    db.refresh(row)
    return row
