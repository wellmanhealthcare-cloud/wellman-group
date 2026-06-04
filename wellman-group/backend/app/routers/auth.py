from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.dependencies import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.schemas.auth import (
    AdminUserResponse,
    ChangePasswordRequest,
    LoginRequest,
    TokenResponse,
)
from app.services.auth_service import (
    authenticate_admin,
    change_password,
    create_access_token_for_admin,
)

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
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
