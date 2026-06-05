from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.dependencies import get_current_admin, get_db
from app.models.admin_user import AdminUser
from app.models.client import Client
from app.models.inquiry import Inquiry
from app.models.job import JobApplication, JobOpening
from app.models.project import Project
from app.models.service import Service
from app.models.team import TeamMember
from app.models.testimonial import Testimonial
from app.schemas.dashboard import DashboardResponse, DashboardStats

router = APIRouter(prefix="/admin/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin),
):
    def count(model):
        return db.query(func.count(model.id)).scalar() or 0

    def count_where(model, *filters):
        return db.query(func.count(model.id)).filter(*filters).scalar() or 0

    stats = DashboardStats(
        total_projects=count(Project),
        total_services=count(Service),
        total_clients=count(Client),
        total_team_members=count(TeamMember),
        total_testimonials=count(Testimonial),
        total_jobs=count(JobOpening),
        open_jobs=count_where(JobOpening, JobOpening.is_open.is_(True)),
        total_inquiries=count(Inquiry),
        unread_inquiries=count_where(Inquiry, Inquiry.is_read.is_(False)),
        total_applications=count(JobApplication),
        unread_applications=count_where(JobApplication, JobApplication.is_read.is_(False)),
    )

    return DashboardResponse(stats=stats, last_updated=datetime.now(timezone.utc))
