from datetime import timedelta, datetime
from fastapi import Depends, APIRouter, Request, Response, status, HTTPException, Cookie, Depends, HTTPException, status, WebSocket, Request, Body
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database.connection import get_db
from fastapi.security import OAuth2PasswordRequestForm
from controller import userController
from model.userModel import User, MyResponse, Message, Chat
from schema.userSchema import Token
from security.authSecurity import create_access_token, get_current_user, get_user_by_username, get_password_hash
from starlette.responses import RedirectResponse
from model import userModel
from database.crud import create_user, create_message, create_chat, get_all_users, get_all_chats, get_all_messages
import jwt
from dotenv import load_dotenv
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi.staticfiles import StaticFiles
from typing import Dict
# import cloudinary
# import cloudinary.uploader

load_dotenv()

# cloudinary.config( 
#   cloud_name = "dlwuhl9ez", 
#   api_key = "825156941529614", 
#   api_secret = "8u__l69vN35HyPIjUWUEMaQq8PA" 
# )

# instance
userRouter = APIRouter()
#templates = Jinja2Templates(directory="templates/") 

# Словарь для хранения соединений WebSocket
connections: Dict[str, WebSocket] = {}

# WebSocket-маршрут для подключения клиента
@userRouter.websocket("/ws/{chat_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: str, user_id: str):
    await websocket.accept()
    connections[user_id] = websocket
    try:
        while True:
            # Получение сообщения от клиента
            data = await websocket.receive_text()
            recipient_id, message = data.split(":")
            # Отправка сообщения получателю
            recipient_socket = connections.get(recipient_id)
            if recipient_socket:
                await recipient_socket.send_text(f"{message}")
    finally:
        # Удаление соединения при отключении клиента
        del connections[user_id]



# @userRouter.post("/upload")
# async def upload_image(url: str):
#     async with httpx.AsyncClient() as client:
#         response = await client.get(url)
#         if response.status_code == 200:
#             uploaded_image = cloudinary.uploader.upload(response.content)
#             return {"public_id": uploaded_image["public_id"]}
#         else:
#             raise HTTPException(status_code=400, detail="Failed to fetch image")


@userRouter.get("/test")
async def get_test():
    return "message: hello!"

@userRouter.get("/index")
def get_index(request: Request):
    return {"request": request.url}


@userRouter.get("/")
def get_index(request: Request):
    #return templates.TemplateResponse("front/home/index.html", {"request": request})
    return {"request": request.url}


@userRouter.get("/signup")
def get_signup(request: Request):
    #return templates.TemplateResponse("auth/signup.html", {"request": request})
	return {"request": request.url}


@userRouter.get("/signin")
def get_signup(request: Request):
    #return templates.TemplateResponse("auth/signin.html", {"request": request})
	return {"message": "Seccessfully signed in"}

@userRouter.get("/api/messenger")
def show_event(current_user: User = Depends(get_current_user)):
    if current_user is None:
        return {"message": "Not authorized"}, 303
    else:
        return {"user": current_user}

@userRouter.get("/api/messenger/{username}/{access_token}")
def show_event(username: str, access_token: str):
    if access_token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized")
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("sub") != username:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")
        
        return {"message": "Authorized", "username": username}
    except jwt.exceptions.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

@userRouter.get("/event/{username}")
def show_event(request: Request, username: str, current_user: User = Depends(get_current_user)):
    if current_user is None:
        return {"message": "Not authorized"}, 303
    else:
        username == current_user.username
        return {"request": request.url, "user": current_user}



@userRouter.post('/api/messages/send_message')
async def create_new_message(
    db: Session = Depends(get_db), 
    form_data: userModel.MessageRequestForm = Depends()
    ):
    new_message = Message(
        text=form_data.text,
        chat_id=form_data.chat_id,
        message_sender=form_data.message_sender,
        current_user_id=form_data.current_user_id,
        partner_user_id=form_data.partner_user_id,
        date_message=datetime.now(),  # Текущее время создания сообщения
        )
    message = create_message(db=db, message=new_message)
    return {"user": message}, 200
    
@userRouter.post('/api/messages/create_chat/')
async def create_new_chat(
        partner_user_id: int = Body(embed=True), partner_username: str = Body(embed=True), 
        partner_user_avatar: str = Body(embed=True),
        db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user is None:
        return {"message": "Not authorized"}, 303
    else:
        new_chat = Chat(
            chat_id=str(current_user.id) + '_' + current_user.username + '_' + partner_username,
            username=current_user.username,
            user_id=current_user.id,
            partner_username=partner_username,
            partner_user_id=partner_user_id,
            user_avatar=current_user.avatar,
            partner_user_avatar=partner_user_avatar,
        )
        chat = create_chat(db=db, chat=new_chat)
        return {"chat": chat}, 200
    

@userRouter.get('/api/messages/users_list')
async def get_users(db: Session = Depends(get_db)):
    users = get_all_users(db=db)
    return {"users": users}


@userRouter.get('/api/messages/chats_list')
async def get_chats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user is None:
        return {"message": "Not authorized"}, 303
    else:
        user_chats = db.query(Chat).filter(or_(Chat.user_id == current_user.id, Chat.partner_user_id == current_user.id)).all()
        return {"chats": user_chats}, 200



@userRouter.get('/api/messages/messages_list/{chat_id}')
async def get_messages(chat_id: str, db: Session = Depends(get_db)):
    messages = get_all_messages(db=db, chat_id=chat_id)
    return {"messages": messages}
    

@userRouter.post("/signup")
async def create_new_user(request: Request, db: Session = Depends(get_db), form_data: userModel.OAuth2PasswordRequestFormSignup = Depends()):
    db_user = get_user_by_username(db=db, username=form_data.username)
    if db_user:
        raise HTTPException(status_code=302, detail="User already exists")
    else:
        if len(form_data.username) < 4 or len(form_data.username) > 15:
            raise HTTPException(status_code=400, detail="Invalid username length")
        
        if len(form_data.password) < 4 or len(form_data.password) > 25:
            raise HTTPException(status_code=400, detail="Invalid password length")
        
        if len(form_data.email) > 32:
            raise HTTPException(status_code=400, detail="Invalid email length")
    
        new_user = User(
            email=form_data.email, 
            username=form_data.username, 
            password=get_password_hash(form_data.password),
            first_name=form_data.first_name,
            last_name=form_data.last_name,
            avatar=form_data.avatar,
            gender=form_data.gender,
            country=form_data.country,
            date=form_data.date,
            )
        user = create_user(db=db, user=new_user)
        return {"user": user}, 200

@userRouter.post("/signin", response_model=Token)
async def login_for_access_token(response:Response, request:Request, db: Session = Depends(get_db), form_data: userModel.OAuth2PasswordRequestFormSignin = Depends()): 
    user = userController.authenticate_user(
        db=db,
        username=form_data.username,
        password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=301, detail="Incorrect account information")
    
    if len(form_data.username) < 4 or len(form_data.username) > 15:
        raise HTTPException(status_code=400, detail="Invalid username length")
    
    if len(form_data.password) < 4 or len(form_data.password) > 25:
        raise HTTPException(status_code=400, detail="Invalid password length")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    response = RedirectResponse(url="/index",status_code=status.HTTP_302_FOUND)
    
    # to save token in cookie
    response.set_cookie(key="access_token",value=f"Bearer {access_token}", httponly=True, samesite=None,
                        secure=True, max_age=3600) 
    return response    


@userRouter.post("/logout")
async def logout(response: Response):
    # Удаляем или очищаем значение cookie
    response.delete_cookie("access_token")

    return {"message": "Logged out successfully"}


# POST chat info
@userRouter.get("/api/check_verification")
async def show_event(current_user: User = Depends(get_current_user)):
    if current_user is None:
        return {"message": "Not authorized"}, 303
    else:
        return {"Verification": "Authorized", "user": current_user}



    
    











