"""Initial12

Revision ID: e47254752140
Revises: 16e9a5defafc
Create Date: 2023-09-28 11:20:23.078264

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'e47254752140'
down_revision: Union[str, None] = '16e9a5defafc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_user_pictures_id', table_name='user_pictures')
    op.drop_index('ix_user_pictures_picture_url', table_name='user_pictures')
    op.drop_index('ix_user_pictures_user_id', table_name='user_pictures')
    op.drop_table('user_pictures')
    op.drop_index('ix_photos_date_message', table_name='photos')
    op.drop_index('ix_photos_id', table_name='photos')
    op.drop_index('ix_photos_is_read', table_name='photos')
    op.drop_table('photos')
    op.drop_index('ix_user_photos_date_message', table_name='user_photos')
    op.drop_index('ix_user_photos_id', table_name='user_photos')
    op.drop_index('ix_user_photos_is_read', table_name='user_photos')
    op.drop_table('user_photos')
    op.create_index(op.f('ix_messages_current_user_id'), 'messages', ['current_user_id'], unique=False)
    op.create_index(op.f('ix_messages_message_sender'), 'messages', ['message_sender'], unique=False)
    op.create_index(op.f('ix_messages_partner_user_id'), 'messages', ['partner_user_id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_messages_partner_user_id'), table_name='messages')
    op.drop_index(op.f('ix_messages_message_sender'), table_name='messages')
    op.drop_index(op.f('ix_messages_current_user_id'), table_name='messages')
    op.create_table('user_photos',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('text', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('chat_id', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('message_sender', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('current_user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('partner_user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('date_message', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('is_read', sa.BOOLEAN(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['chat_id'], ['chats.chat_id'], name='user_photos_chat_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='user_photos_pkey')
    )
    op.create_index('ix_user_photos_is_read', 'user_photos', ['is_read'], unique=False)
    op.create_index('ix_user_photos_id', 'user_photos', ['id'], unique=False)
    op.create_index('ix_user_photos_date_message', 'user_photos', ['date_message'], unique=False)
    op.create_table('photos',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('text', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('chat_id', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.Column('message_sender', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('current_user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('partner_user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('date_message', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('is_read', sa.BOOLEAN(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['chat_id'], ['chats.chat_id'], name='photos_chat_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='photos_pkey')
    )
    op.create_index('ix_photos_is_read', 'photos', ['is_read'], unique=False)
    op.create_index('ix_photos_id', 'photos', ['id'], unique=False)
    op.create_index('ix_photos_date_message', 'photos', ['date_message'], unique=False)
    op.create_table('user_pictures',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('picture_url', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='user_pictures_pkey')
    )
    op.create_index('ix_user_pictures_user_id', 'user_pictures', ['user_id'], unique=False)
    op.create_index('ix_user_pictures_picture_url', 'user_pictures', ['picture_url'], unique=False)
    op.create_index('ix_user_pictures_id', 'user_pictures', ['id'], unique=False)
    # ### end Alembic commands ###