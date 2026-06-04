from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.admin_user import AdminUser


def get_admin_by_email(db: Session, email: str) -> AdminUser | None:
    return db.query(AdminUser).filter(AdminUser.email == email).first()


def authenticate_admin(db: Session, email: str, password: str) -> AdminUser | None:
    """
    Verify credentials and return the AdminUser on success.
    Returns None if the account does not exist, is inactive, or the password is wrong.
    Updates last_login on successful authentication.
    """
    admin = get_admin_by_email(db, email)
    if not admin or not admin.is_active:
        return None
    if not verify_password(password, admin.password_hash):
        return None
    admin.last_login = datetime.now(timezone.utc)
    db.commit()
    db.refresh(admin)
    return admin


def create_access_token_for_admin(admin: AdminUser) -> str:
    """
    Issue a signed JWT for the given admin.
    Payload: sub=admin_id, email=admin.email
    Note: no role claim — AdminUser model has no role field.
    """
    return create_access_token(
        subject=str(admin.id),
        extra_claims={"email": admin.email},
    )


def change_password(
    db: Session,
    admin_id: UUID,
    old_password: str,
    new_password: str,
) -> bool:
    """
    Verify old_password, then replace the hash with new_password.
    Returns True on success, False if admin not found or old_password is wrong.
    """
    admin = db.query(AdminUser).filter(AdminUser.id == admin_id).first()
    if not admin:
        return False
    if not verify_password(old_password, admin.password_hash):
        return False
    admin.password_hash = hash_password(new_password)
    db.commit()
    return True
