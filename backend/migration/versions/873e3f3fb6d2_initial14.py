"""Initial14

Revision ID: 873e3f3fb6d2
Revises: 285326178038
Create Date: 2023-09-29 08:13:29.537558

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '873e3f3fb6d2'
down_revision: Union[str, None] = '285326178038'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('likes', sa.Column('post_id', sa.Integer(), nullable=True))
    op.add_column('likes', sa.Column('like', sa.Integer(), nullable=True))
    op.drop_index('ix_likes_date_picture', table_name='likes')
    op.drop_index('ix_likes_likes', table_name='likes')
    op.drop_index('ix_likes_picture_url', table_name='likes')
    op.create_index(op.f('ix_likes_like'), 'likes', ['like'], unique=False)
    op.create_index(op.f('ix_likes_post_id'), 'likes', ['post_id'], unique=False)
    op.drop_column('likes', 'date_picture')
    op.drop_column('likes', 'picture_url')
    op.drop_column('likes', 'likes')
    op.add_column('pictures', sa.Column('likes', sa.Integer(), nullable=True))
    op.create_index(op.f('ix_pictures_likes'), 'pictures', ['likes'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_pictures_likes'), table_name='pictures')
    op.drop_column('pictures', 'likes')
    op.add_column('likes', sa.Column('likes', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('likes', sa.Column('picture_url', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('likes', sa.Column('date_picture', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.drop_index(op.f('ix_likes_post_id'), table_name='likes')
    op.drop_index(op.f('ix_likes_like'), table_name='likes')
    op.create_index('ix_likes_picture_url', 'likes', ['picture_url'], unique=False)
    op.create_index('ix_likes_likes', 'likes', ['likes'], unique=False)
    op.create_index('ix_likes_date_picture', 'likes', ['date_picture'], unique=False)
    op.drop_column('likes', 'like')
    op.drop_column('likes', 'post_id')
    # ### end Alembic commands ###
