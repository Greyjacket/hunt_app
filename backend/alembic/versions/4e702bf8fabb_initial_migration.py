"""Initial migration

Revision ID: 4e702bf8fabb
Revises: 
Create Date: 2023-12-14 21:24:04.586352

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4e702bf8fabb'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('participants',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('phone1', sa.String(), nullable=True),
    sa.Column('phone2', sa.String(), nullable=True),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('address', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_participants_id'), 'participants', ['id'], unique=False)
    op.create_index(op.f('ix_participants_name'), 'participants', ['name'], unique=False)
    op.create_table('leads',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('buyer_id', sa.Integer(), nullable=True),
    sa.Column('seller_id', sa.Integer(), nullable=True),
    sa.Column('interest', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['buyer_id'], ['participants.id'], ),
    sa.ForeignKeyConstraint(['seller_id'], ['participants.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_leads_id'), 'leads', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_leads_id'), table_name='leads')
    op.drop_table('leads')
    op.drop_index(op.f('ix_participants_name'), table_name='participants')
    op.drop_index(op.f('ix_participants_id'), table_name='participants')
    op.drop_table('participants')
    # ### end Alembic commands ###
