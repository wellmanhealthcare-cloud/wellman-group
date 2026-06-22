"""add notification_channel to site_settings

Revision ID: add_notification_channel
Revises: add_service_products
Create Date: 2026-06-22

"""
from alembic import op
import sqlalchemy as sa

revision = 'add_notification_channel'
down_revision = 'add_service_products'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'site_settings',
        sa.Column('notification_channel', sa.String(), nullable=False, server_default='whatsapp'),
    )


def downgrade() -> None:
    op.drop_column('site_settings', 'notification_channel')
