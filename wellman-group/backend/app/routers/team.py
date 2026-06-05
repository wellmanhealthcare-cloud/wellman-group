from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.models.team import TeamMember
from app.schemas.team import (
    TeamMemberCreate,
    TeamMemberResponse,
    TeamMemberUpdate,
    TeamReorder,
)

public_router = APIRouter(prefix="/team", tags=["Team"])
admin_router = APIRouter(prefix="/admin/team", tags=["Team — Admin"])


# ── Public ─────────────────────────────────────────────────────────────────────

@public_router.get("", response_model=list[TeamMemberResponse])
def list_team(db: Session = Depends(get_db)):
    return (
        db.query(TeamMember)
        .filter(TeamMember.is_active.is_(True))
        .order_by(TeamMember.order_index)
        .all()
    )


# ── Admin ──────────────────────────────────────────────────────────────────────

@admin_router.get("", response_model=list[TeamMemberResponse])
def admin_list_team(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    return db.query(TeamMember).order_by(TeamMember.order_index).all()


@admin_router.post("", response_model=TeamMemberResponse, status_code=status.HTTP_201_CREATED)
def create_member(
    body: TeamMemberCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    member = TeamMember(**body.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


# /reorder declared before /{member_id} so FastAPI doesn't treat "reorder" as a UUID
@admin_router.patch("/reorder", response_model=list[TeamMemberResponse])
def reorder_team(
    body: TeamReorder,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    for item in body.items:
        member = db.query(TeamMember).filter(TeamMember.id == item.id).first()
        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Member {item.id} not found",
            )
        member.order_index = item.order_index
    db.commit()
    return db.query(TeamMember).order_by(TeamMember.order_index).all()


@admin_router.put("/{member_id}", response_model=TeamMemberResponse)
def update_member(
    member_id: UUID,
    body: TeamMemberUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team member not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(member, field, value)
    db.commit()
    db.refresh(member)
    return member


@admin_router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_member(
    member_id: UUID,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team member not found")
    db.delete(member)
    db.commit()
