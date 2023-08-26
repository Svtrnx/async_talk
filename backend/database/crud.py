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


def create_user(db: Session, user: userSchema.UserSchema):
    new_user = userModel.User(
        username   = user.username,
        password   = user.password,
        email	   = user.email,
        first_name = user.first_name,
        last_name  = user.last_name,
        gender     = user.gender,
        country    = user.country,
        date       = user.date,
        is_Admin   = user.is_Admin,
        is_Active  = user.is_Active
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user



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



# def get_messages(db: Session, skip: int = 0, limit: int = 100):
#     query = select(userModel.User).offset(skip).limit(limit)
#     return db.execute(query).scalars().all()



def create_message(db: Session, message: userSchema.MessageSchema):
    new_message             = userModel.Message(
        text                = message.text,
        chat_id             = message.chat_id,
        message_sender      = message.message_sender,
        current_user_id     = message.current_user_id,
        partner_user_id     = message.partner_user_id,
        user_avatar         = message.user_avatar,
        partner_user_avatar = message.partner_user_avatar,
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







