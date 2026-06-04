import sys
import os

# Allow running from backend/ directory: python scripts/create_admin.py
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.security import hash_password
from app.database import SessionLocal
from app.models.admin_user import AdminUser

NAME = "Admin"
EMAIL = "admin@wellmangroup.in"
PASSWORD = "Kar@2005"

db = SessionLocal()

try:
    existing = db.query(AdminUser).filter(AdminUser.email == EMAIL).first()
    if existing:
        print(f"Admin already exists: {EMAIL}")
        sys.exit(0)

    admin = AdminUser(
        name=NAME,
        email=EMAIL,
        password_hash=hash_password(PASSWORD),
        is_active=True,
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    print(f"Admin created: {admin.email} (id: {admin.id})")
finally:
    db.close()
