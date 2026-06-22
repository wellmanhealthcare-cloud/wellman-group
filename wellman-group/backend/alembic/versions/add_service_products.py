"""add service_products table

Revision ID: add_service_products
Revises: bc3d5d302a1d
Create Date: 2026-06-13

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = 'add_service_products'
down_revision = 'bc3d5d302a1d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'service_products',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('service_slug', sa.String(), nullable=False, index=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('image_url', sa.String(), nullable=True),
        sa.Column('order_index', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=True, server_default='true'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('service_products')
