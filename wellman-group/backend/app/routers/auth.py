from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.limiter import limiter
from app.dependencies import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.core.security import hash_password
from app.schemas.auth import (
    AdminUserResponse,
    AdminUserUpdate,
    ChangePasswordRequest,
    LoginRequest,
    SetupRequest,
    TokenResponse,
)
from app.services.auth_service import (
    authenticate_admin,
    change_password,
    create_access_token_for_admin,
)

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
def login(request: Request, body: LoginRequest, db: Session = Depends(get_db)):
    admin = authenticate_admin(db, body.email, body.password)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return TokenResponse(
        access_token=create_access_token_for_admin(admin),
        expires_in=settings.JWT_EXPIRE_MINUTES * 60,
    )


@router.get("/me", response_model=AdminUserResponse)
def me(admin: AdminUser = Depends(get_current_admin)):
    return admin


@router.put("/me", response_model=AdminUserResponse)
def update_me(
    body: AdminUserUpdate,
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    updates = body.model_dump(exclude_unset=True, exclude={"is_active"})

    if "email" in updates:
        conflict = (
            db.query(AdminUser)
            .filter(AdminUser.email == updates["email"], AdminUser.id != admin.id)
            .first()
        )
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email is already in use",
            )

    for field, value in updates.items():
        setattr(admin, field, value)

    db.commit()
    db.refresh(admin)
    return admin


@router.put("/change-password", status_code=status.HTTP_200_OK)
def update_password(
    body: ChangePasswordRequest,
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    success = change_password(db, admin.id, body.old_password, body.new_password)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )
    return {"message": "Password updated successfully"}


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(admin: AdminUser = Depends(get_current_admin)):
    # JWT is stateless — token is invalidated client-side by discarding it.
    # Server-side blocklisting is not implemented (no Redis/DB token store).
    return {"message": "Logged out successfully"}


@router.get("/needs-setup")
def needs_setup(db: Session = Depends(get_db)):
    """Returns true if no admin account exists yet — used by the setup page."""
    count = db.query(AdminUser).count()
    return {"needs_setup": count == 0}


@router.post("/setup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def setup(body: SetupRequest, db: Session = Depends(get_db)):
    """Create the first admin account. Disabled once any admin exists."""
    if db.query(AdminUser).count() > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Admin account already exists. Use /admin/login instead.",
        )
    admin = AdminUser(
        name=body.name,
        email=body.email,
        password_hash=hash_password(body.password),
        is_active=True,
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return TokenResponse(
        access_token=create_access_token_for_admin(admin),
        expires_in=settings.JWT_EXPIRE_MINUTES * 60,
    )
