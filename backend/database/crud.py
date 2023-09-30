from sqlalchemy.orm import Session
from sqlalchemy import or_
from model import userModel
from schema import userSchema
from sqlalchemy import select
from fastapi import HTTPException, status


def get_user(db: Session, skip: int = 0, limit: int = 100):
    query = select(userModel.User).offset(skip).limit(limit)
    return db.execute(query).scalars().all()

def get_all_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(userModel.User).offset(skip).limit(limit).all()

def get_all_chats(db: Session, current_user_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(userModel.Chat)
        .filter(
            or_(
                userModel.Chat.user_id == current_user_id,
                userModel.Chat.partner_user_id == current_user_id
            )
        )
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_all_messages(db: Session, chat_id: str, skip: int = 0, limit: int = 100):
    return db.query(userModel.Message).filter(userModel.Message.chat_id == chat_id).offset(skip).limit(limit).all()


def get_user_by_id(db: Session, user_id: int):
    query = select(userModel.User).filter(userModel.User.id == user_id)
    return db.execute(query).scalars().first()

def get_picture_by_id(db: Session, picture_id: int):
    query = select(userModel.Picture).filter(userModel.Picture.id == picture_id)
    return db.execute(query).scalars().first()

def get_picture_by_id_in_likes(db: Session, post_id: int):
    query = select(userModel.Like).filter(userModel.Like.post_id == post_id)
    return db.execute(query).scalars().first()


def create_user(db: Session, user: userSchema.UserSchema):
    new_user = userModel.User(
        username   = user.username,
        password   = user.password,
        email	   = user.email,
        first_name = user.first_name,
        last_name  = user.last_name,
        avatar     = user.avatar,
        gender     = user.gender,
        city       = user.city,
        country    = user.country,
        date       = user.date,
        is_Admin   = user.is_Admin,
        is_Active  = user.is_Active
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def create_picture(db: Session, picture: userSchema.PictureSchema):
    new_picture = userModel.Picture(
        username      = picture.username,
        picture_url   = picture.picture_url,
    )
    db.add(new_picture)
    db.commit()
    db.refresh(new_picture)
    return new_picture

def create_like(db: Session, like: userSchema.LikeSchema):
    new_like = userModel.Like(
        owner_username      = like.owner_username,
        liker_username      = like.liker_username,
        post_id             = like.post_id,
        like                = like.like,
    )
    db.add(new_like)
    db.commit()
    db.refresh(new_like)
    return new_like

def delete_like(db: Session, post_id: int):
    like_to_delete = db.query(userModel.Like).filter_by(post_id=post_id).first()
    
    if like_to_delete:
        db.delete(like_to_delete)
        db.commit()



def remove_user(db: Session, user_id: int):
    user = get_user_by_id(db=db, user_id=user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    db.delete(user)
    db.commit()


def update_user(db: Session, user_id: int, updated_data: userSchema.UserSchema):
    user = get_user_by_id(db=db, user_id=user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    for field, value in updated_data.dict(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user




def create_message(db: Session, message: userSchema.MessageSchema):
    new_message             = userModel.Message(
        text                = message.text,
        chat_id             = message.chat_id,
        message_sender      = message.message_sender,
        current_user_id     = message.current_user_id,
        partner_user_id     = message.partner_user_id,
        date_message        = message.date_message,
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message


def create_chat(db: Session, chat: userSchema.ChatSchema):
    new_chat = userModel.Chat(
        chat_id              = chat.chat_id,
        username             = chat.username,
        user_id              = chat.user_id,
        partner_username     = chat.partner_username,
        partner_user_id      = chat.partner_user_id,
        user_avatar          = chat.user_avatar,
        partner_user_avatar  = chat.partner_user_avatar,
    )
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return new_chat







