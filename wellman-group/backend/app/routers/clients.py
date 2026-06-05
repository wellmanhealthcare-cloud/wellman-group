from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.models.client import Client
from app.schemas.client import (
    ClientCreate,
    ClientResponse,
    ClientReorder,
    ClientUpdate,
)

public_router = APIRouter(prefix="/clients", tags=["Clients"])
admin_router = APIRouter(prefix="/admin/clients", tags=["Clients — Admin"])


# ── Public ─────────────────────────────────────────────────────────────────────

@public_router.get("", response_model=list[ClientResponse])
def list_clients(db: Session = Depends(get_db)):
    return (
        db.query(Client)
        .filter(Client.is_active.is_(True))
        .order_by(Client.order_index)
        .all()
    )


# ── Admin ──────────────────────────────────────────────────────────────────────

@admin_router.get("", response_model=list[ClientResponse])
def admin_list_clients(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    return db.query(Client).order_by(Client.order_index).all()


@admin_router.post("", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
def create_client(
    body: ClientCreate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    client = Client(**body.model_dump())
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


@admin_router.patch("/reorder", response_model=list[ClientResponse])
def reorder_clients(
    body: ClientReorder,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    for item in body.items:
        client = db.query(Client).filter(Client.id == item.id).first()
        if not client:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Client {item.id} not found",
            )
        client.order_index = item.order_index
    db.commit()
    return db.query(Client).order_by(Client.order_index).all()


@admin_router.put("/{client_id}", response_model=ClientResponse)
def update_client(
    client_id: UUID,
    body: ClientUpdate,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(client, field, value)
    db.commit()
    db.refresh(client)
    return client


@admin_router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(
    client_id: UUID,
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    db.delete(client)
    db.commit()
