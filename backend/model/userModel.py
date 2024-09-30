from datetime import datetime
from typing import Optional
from fastapi import Form
from sqlalchemy import Boolean, Column, Integer, String, MetaData, TIMESTAMP, ForeignKey, Table, CheckConstraint, DateTime, Text, update
from database.connection import Base
from pydantic import BaseModel
from sqlalchemy.orm import relationship, declarative_base, validates

metadata = MetaData()
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String, unique=False, index=True)
    first_name = Column(String, unique=False, index=True)
    last_name = Column(String, unique=False, index=True)
    gender = Column(String, unique=False, index=True)
    country = Column(String, unique=False, index=True)
    city = Column(String, unique=False, index=True)
    date = Column(String, unique=False, index=True)
    date_reg = Column(TIMESTAMP, default=datetime.utcnow, index=True)
    avatar = Column(String, unique=False, index=True)
    headerImg = Column(String, unique=False, index=True)
    user_status = Column(String, unique=False, index=True)
    is_Admin = Column("is_Admin", Boolean, default=False)
    is_Active = Column(Boolean, default=True)
    twoAuth = Column(Boolean, default=False)
    lastUpdatedPassword = Column(TIMESTAMP, default=datetime.utcnow, index=True)
    
    @validates('password')
    def update_last_updated_password(self, key, value):
        self.lastUpdatedPassword = datetime.utcnow()
        return value
    
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
    last_message = Column(String, index=True)
    last_message_timestamp = Column(TIMESTAMP, default=datetime.utcnow, index=True)


    user = relationship("User", foreign_keys=[user_id], back_populates="chats")
    messages = relationship("Message", back_populates="chat")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    chat_id = Column(String, ForeignKey("chats.chat_id"))
    message_sender = Column(Integer, index=True)
    current_user_id = Column(Integer, index=True)
    partner_user_id = Column(Integer, index=True)  
    date_message = Column(TIMESTAMP, default=datetime.utcnow, index=True)
    is_read = Column(Boolean, default=False, index=True)
    
    chat = relationship("Chat", back_populates="messages")
    
    
class Picture(Base):
    __tablename__ = "pictures"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    likes = Column(Integer, index=True, default=0)
    picture_url = Column(String, index=True)
    date_picture = Column(TIMESTAMP, default=datetime.utcnow, index=True)
    
class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, index=True)
    like = Column(Integer, index=True)
    owner_username = Column(String, index=True)
    liker_username = Column(String, index=True)
    
    
class RequestFormFromVerifEmail(BaseModel):
    email: str
    code_length: int
    email_message: str
    email_subject: str
    condition: str
    
class RequestFormFromVerifEmailResetPasswordLink(BaseModel):
    email: str
    
class MarkAsReadRequest(BaseModel):
    message_id: int
    
class RequestFormFromChangePassword(BaseModel):
    password: str
    
class ChangePasswordRequest(BaseModel):
    token: str
    email: str
    new_password: str
    
class MessageRequestForm:
	
    def __init__(
        self,
        text: str = Form(),
        chat_id: str = Form(),
        message_sender: int = Form(),
        current_user_id: int = Form(),
        partner_user_id: int = Form(),
    ):
        self.text = text
        self.chat_id = chat_id
        self.message_sender = message_sender
        self.current_user_id = current_user_id
        self.partner_user_id = partner_user_id
        
class PictureRequestForm:
    def __init__(
        self,
        username: str = Form(),
        picture_url: str = Form(),
    ):
        self.username = username
        self.picture_url = picture_url
        
        
class LikesRequestForm:
    def __init__(
        self,
        post_id: int = Form(),
        like: int = Form(),
        owner_username: str = Form(),
    ):
        self.post_id = post_id
        self.like = like
        self.owner_username = owner_username
        
        

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
        avatar: str = Form(default=""),
        headerImg: str = Form(default=""),
        gender: str = Form(default=""),
        country: str = Form(default=""),
        city: str = Form(default=""),
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
        self.avatar = avatar
        self.headerImg = headerImg
        self.gender = gender
        self.country = country
        self.city = city
        self.date = date
        self.scopes = scope.split()
        self.client_id = client_id
        self.client_secret = client_secret
        
class OAuth2ChangeUserDataForm:
    def __init__(
        self,
        email: str = Form(default=None),
        username: str = Form(default=None),
        password: str = Form(default=None),
        first_name: str = Form(default=None),
        last_name: str = Form(default=None),
        avatar: str = Form(default=None),
        headerImg: str = Form(default=None),
        gender: str = Form(default=None),
        country: str = Form(default=None),
        user_status: str = Form(default=None),
        city: str = Form(default=None),
        date: str = Form(default=None),
        twoAuth: Optional[bool] = Form(default=False),
    ):
        self.email = email
        self.username = username
        self.password = password
        self.first_name = first_name
        self.last_name = last_name
        self.avatar = avatar
        self.headerImg = headerImg
        self.gender = gender
        self.country = country
        self.user_status = user_status
        self.city = city
        self.date = date
        self.twoAuth = twoAuth

class VerifyPassword:
	
    def __init__(
        self,
        password_old: str = Form(default=None),
    ):
        self.password_old = password_old

    
class requestFormFromChangePassword:

    def __init__(
        self,
        email: str = Form(),
        password: str = Form(),
    ):
        self.email = email
        self.password = password

class OAuth2PasswordRequestFormSignin:

    def __init__(
        self,
        username: str = Form(),
        password: str = Form(),
    ):
        self.username = username
        self.password = password















