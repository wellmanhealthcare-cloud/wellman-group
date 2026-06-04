from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DashboardStats(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    total_projects: int
    total_services: int
    total_clients: int
    total_team_members: int
    total_testimonials: int
    total_jobs: int
    open_jobs: int
    total_inquiries: int
    unread_inquiries: int
    total_applications: int
    unread_applications: int


class DashboardResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    stats: DashboardStats
    last_updated: datetime
