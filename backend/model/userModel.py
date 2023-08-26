from datetime import datetime
from typing import Optional
from fastapi import Form
from sqlalchemy import Boolean, Column, Integer, String, MetaData, TIMESTAMP, ForeignKey, Table, CheckConstraint, DateTime
from database.connection import Base
from pydantic import BaseModel
from sqlalchemy.orm import relationship, declarative_base

metadata = MetaData()
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=False)
    password = Column(String)
    first_name = Column(String, unique=False, index=True)
    last_name = Column(String, unique=False, index=True)
    gender = Column(String, unique=False, index=True)
    country = Column(String, unique=False, index=True)
    avatar = Column(String, unique=False, index=True)
    date = Column(String, unique=False, index=True)
    date_reg = Column(TIMESTAMP, default=datetime.utcnow, index=True)
    is_Admin = Column("is_Admin", Boolean, default=False)
    is_Active = Column(Boolean, default=True)
    
    chats = relationship("Chat", back_populates="user")
    
    # __table_args__ = (
    #     CheckConstraint("length(username) >= 4",  name="check_username_length1"),
    #     CheckConstraint("length(password) >= 4",  name="check_password_length1"),
    #     CheckConstraint("length(email)    <= 32", name="check_email_length"),
    #     CheckConstraint("length(username) <= 15", name="check_username_length2"),
    #     # CheckConstraint("length(password) <= 25", name="check_password_length2"),
    # )
    
class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(String, index=True, unique=True)
    username = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    partner_username = Column(String, index=True)
    partner_user_id = Column(Integer, index=True)
    user_avatar = Column(String, index=True)
    partner_user_avatar = Column(String, index=True)


    user = relationship("User", foreign_keys=[user_id], back_populates="chats")
    messages = relationship("Message", back_populates="chat")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    chat_id = Column(String, ForeignKey("chats.chat_id"))
    message_sender = Column(Integer)
    current_user_id = Column(Integer)
    partner_user_id = Column(Integer)
    user_avatar = Column(String, default='', index=True)
    partner_user_avatar = Column(String, default='', index=True)    
    date_message= Column(TIMESTAMP, default=datetime.utcnow, index=True)
    
    chat = relationship("Chat", back_populates="messages")
    
class MessageRequestForm:
	
    def __init__(
        self,
        text: str = Form(),
        chat_id: str = Form(),
        message_sender: int = Form(),
        current_user_id: int = Form(),
        partner_user_id: int = Form(),
        user_avatar: str = Form(),
        partner_user_avatar: str = Form(),
    ):
        self.text = text
        self.chat_id = chat_id
        self.message_sender = message_sender
        self.current_user_id = current_user_id
        self.partner_user_id = partner_user_id
        self.user_avatar = user_avatar
        self.partner_user_avatar = partner_user_avatar
        
# class ChatRequestForm:
	
#     def __init__(
#         self,
#         name: str = Form(),
#         # user_id: int = Form(),
#     ):
#         self.name = name
#         # self.user_id = user_id

class MyResponse(BaseModel):
	request: str
	error: str
    
    
    
class OAuth2PasswordRequestFormSignup:

    def __init__(
        self,
        grant_type: str = Form(default=None, regex="password"),
        email: str = Form(),
        username: str = Form(),
        password: str = Form(),
        first_name: str = Form(),
        last_name: str = Form(),
        gender: str = Form(default=""),
        country: str = Form(default=""),
        date: str = Form(default=""),
        scope: str = Form(default=""),
        client_id: Optional[str] = Form(default=None),
        client_secret: Optional[str] = Form(default=None),
    ):
        self.grant_type = grant_type
        self.email = email
        self.username = username
        self.password = password
        self.first_name = first_name
        self.last_name = last_name
        self.gender = gender
        self.country = country
        self.date = date
        self.scopes = scope.split()
        self.client_id = client_id
        self.client_secret = client_secret

class OAuth2PasswordRequestFormSignin:

    def __init__(
        self,
        grant_type: str = Form(default=None, regex="password"),
        username: str = Form(),
        password: str = Form(),
        scope: str = Form(default=""),
        client_id: Optional[str] = Form(default=None),
        client_secret: Optional[str] = Form(default=None),
    ):
        self.grant_type = grant_type
        self.username = username
        self.password = password
        self.scopes = scope.split()
        self.client_id = client_id
        self.client_secret = client_secret














