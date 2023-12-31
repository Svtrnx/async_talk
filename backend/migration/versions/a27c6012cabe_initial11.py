"""Initial11

Revision ID: a27c6012cabe
Revises: 403d8e719a9d
Create Date: 2023-09-28 09:01:31.978921

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a27c6012cabe'
down_revision: Union[str, None] = '403d8e719a9d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('city', sa.String(), nullable=True))
    op.create_index(op.f('ix_users_city'), 'users', ['city'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_users_city'), table_name='users')
    op.drop_column('users', 'city')
    # ### end Alembic commands ###
