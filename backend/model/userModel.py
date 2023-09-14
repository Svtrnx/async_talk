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
    date = Column(String, unique=False, index=True)
    date_reg = Column(TIMESTAMP, default=datetime.utcnow, index=True)
    avatar = Column(String, unique=False, index=True)
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
    date_message= Column(TIMESTAMP, default=datetime.utcnow, index=True)
    
    chat = relationship("Chat", back_populates="messages")
    
class RequestFormFromVerifEmail(BaseModel):
    email: str
    code_length: int
    email_message: str
    email_subject: str
    condition: str
    
class RequestFormFromVerifEmailResetPasswordLink(BaseModel):
    email: str
    
    
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
        self.avatar = avatar
        self.gender = gender
        self.country = country
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
        gender: str = Form(default=None),
        country: str = Form(default=None),
        date: str = Form(default=None),
        twoAuth: Optional[bool] = Form(default=False),
    ):
        self.email = email
        self.username = username
        self.password = password
        self.first_name = first_name
        self.last_name = last_name
        self.avatar = avatar
        self.gender = gender
        self.country = country
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















