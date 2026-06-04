from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional


class DashboardStats(BaseModel):
    total_projects: int
    total_services: int
    total_clients: int
    total_inquiries: int
    unread_inquiries: int
    total_applications: int
    unread_applications: int


class DashboardResponse(BaseModel):
    stats: DashboardStats
    last_updated: datetime

    model_config = {"from_attributes": True}
