"""Initial8

Revision ID: ea8785cc1ad2
Revises: 828e582cf4b7
Create Date: 2023-09-08 21:39:33.719385

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ea8785cc1ad2'
down_revision: Union[str, None] = '828e582cf4b7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('lastUpdatedPassword', sa.TIMESTAMP(), nullable=True))
    op.create_index(op.f('ix_users_lastUpdatedPassword'), 'users', ['lastUpdatedPassword'], unique=False)
    op.drop_column('users', 'headerImg')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('headerImg', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_index(op.f('ix_users_lastUpdatedPassword'), table_name='users')
    op.drop_column('users', 'lastUpdatedPassword')
    # ### end Alembic commands ###
