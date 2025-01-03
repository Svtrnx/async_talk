"""Initial12

Revision ID: 16e9a5defafc
Revises: a27c6012cabe
Create Date: 2023-09-28 09:20:05.997433

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '16e9a5defafc'
down_revision: Union[str, None] = 'a27c6012cabe'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('user_status', sa.String(), nullable=True))
    op.create_index(op.f('ix_users_user_status'), 'users', ['user_status'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_users_user_status'), table_name='users')
    op.drop_column('users', 'user_status')
    # ### end Alembic commands ###