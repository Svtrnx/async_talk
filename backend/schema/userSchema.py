from pydantic import BaseModel, Field
from typing import List, Optional, Generic, TypeVar
from pydantic.generics import GenericModel
from datetime import datetime

T = TypeVar('T')

# USER SCHEMA

class UserSchema(BaseModel):
    id: Optional[int]=None
    email: Optional[str]=None
    username: Optional[str]=None
    password: Optional[str]=None
    first_name: Optional[str]=None
    last_name: Optional[str]=None
    gender: Optional[str]=None
    country: Optional[str]=None
    avatar: Optional[str]=None
    headerImg: Optional[str]=None
    date: Optional[str]=None
    date_reg: Optional[datetime] = None 
    is_Admin: Optional[bool]=None
    is_Active: Optional[bool]=None
    twoAuth: Optional[bool]=None
    lastUpdatedPassword: Optional[datetime] = None 
    
    class Config:
        orm_mode = True
    
class ChatSchema(BaseModel):
    id: int
    chat_id: Optional[str]=None
    username: Optional[str]=None
    user_id: Optional[int]=None
    partner_username: Optional[str]=None
    partner_user_id: Optional[int] = None
    user_avatar: Optional[str] = None
    partner_user_avatar: Optional[str] = None
    last_message: Optional[str] = None
    last_message_timestamp: Optional[datetime] = None 
    
    user: "UserSchema"
    messages: List["MessageSchema"]

    class Config:
        orm_mode = True


class MessageSchema(BaseModel):
    id: int
    text: Optional[str]=None
    chat_id: Optional[str]=None
    message_sender: Optional[int]=None
    current_user_id: Optional[int]=None
    partner_user_id: Optional[int]=None
    date_message: Optional[datetime] = None 
    chat: ChatSchema
    is_read: bool = False

    class Config:
        orm_mode = True
        
        
class RequestUser(BaseModel):
    parameter: UserSchema = Field(...)
    
    
# MESSAGE SCHEMA
    
        
class RequestMessage(BaseModel):
    parameter: MessageSchema = Field(...)

class Response (GenericModel, Generic[T]):
    code: str
    status: str
    message: str
    result: Optional[T]

class Token(BaseModel):
    access_token: str
    token_type: str












