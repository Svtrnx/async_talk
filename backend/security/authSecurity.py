from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status, APIRouter
#from jose import jwt
import jwt
from passlib.context import CryptContext
from controller import userController
from sqlalchemy.orm import Session
from typing import Union
from database.connection import get_db
from fastapi import Depends, APIRouter, Request, Response, status
from security.cookie import OAuth2PasswordBearerWithCookie
from dotenv import load_dotenv
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, COOKIE_NAME
from model.userModel import User    

load_dotenv()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="signin") # Должна быть одинаковая ссылка с signin

authRouter = APIRouter()


def get_password_hash(password):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm='HS256')
    return encoded_jwt


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    user = get_user_by_username(db=db, username=payload.get("sub"))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if user.username != payload.get("sub"):
        raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Access forbidden",
    )
    return user


    
    
    
    
    
    
    
    
    
    
    
    
    
    
