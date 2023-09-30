from datetime import timedelta, datetime
from fastapi import Depends, APIRouter, Request, Response, status, Cookie, Depends, HTTPException, status, WebSocket, Request, Body, Form, Path
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database.connection import get_db
from fastapi.security import OAuth2PasswordRequestForm
from controller import userController
from model.userModel import User, MyResponse, Message, Chat, Picture, Like
from schema.userSchema import Token
from security.authSecurity import create_access_token, get_current_user, get_user_by_username, get_password_hash, oauth2_scheme, get_user_by_email, generate_reset_token, generate_reset_code, verify_reset_token
from starlette.responses import RedirectResponse
from model import userModel
from database.crud import create_user, create_message, create_chat, get_all_users, get_all_chats, get_all_messages, get_user_by_id, create_picture, get_picture_by_id, create_like, get_picture_by_id_in_likes, delete_like
from database.cache import set_message_read_status, get_message_read_status
import jwt
from dotenv import load_dotenv
from config import SMTP_USERNAME, SMTP_PASSWORD
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from typing import Dict
import smtplib
from email.message import EmailMessage
load_dotenv()

# instance
userRouter = APIRouter()
#templates = Jinja2Templates(directory="templates/") 


connections: Dict[str, WebSocket] = {}

@userRouter.websocket("/ws/{chat_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: str, user_id: str):
    await websocket.accept()
    connections[user_id] = websocket
    try:
        while True:
            data = await websocket.receive_text()
            recipient_id, message = data.split(":")
            
            recipient_socket = connections.get(recipient_id)
            if recipient_socket:
                await recipient_socket.send_text(f"{message}")
    finally:
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
        date_message=datetime.now(), 
        )
    message = create_message(db=db, message=new_message)
    
    chat = db.query(Chat).filter(Chat.chat_id == form_data.chat_id).first()

    chat.last_message = form_data.text
    chat.last_message_timestamp = datetime.now()

    db.commit()
    return {"user": message, "last_message": form_data.text}, 200
    
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
    user_data = [{
        
                    "id": user.id,
                    "email": user.email, 
                    "username": user.username, 
                    "first_name": user.first_name, 
                    "gender": user.gender, 
                    "date": user.date, 
                    "avatar": user.avatar, 
                    "last_name": user.last_name, 
                    "country": user.country, 
                    "date_reg": user.date_reg, 
                    "headerImg": user.headerImg, 
                    "is_Active": user.is_Active} for user in users]
    return {"users": user_data}, 200


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
            city=form_data.city,
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
    
    response = RedirectResponse(url='/index',status_code=status.HTTP_302_FOUND)

    response.set_cookie(key="access_token",value=f"Bearer {access_token}", samesite='none', httponly=True,
                        secure=True, max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60) 
    return response


@userRouter.post("/check-2auth")
async def check_2auth_verif(db: Session = Depends(get_db), form_data: userModel.OAuth2PasswordRequestFormSignin = Depends()):
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
    
    return {'user2Step': user.twoAuth, 'userEmail': user.email}


@userRouter.post("/logout")
async def logout(response: Response):
    
    response.delete_cookie("access_token", samesite="none", secure=True, httponly=True)

    return {"message": "Logged out successfully"}

# POST chat info
@userRouter.get("/api/check_verification")
async def show_event(current_user: User = Depends(get_current_user)):
    if current_user is None:
        return {"message": "Not authorized"}, 303
    else:
        return {"Verification": "Authorized", "user": current_user}


@userRouter.post("/request-reset")
async def request_reset_password(data: userModel.RequestFormFromVerifEmailResetPasswordLink, db: Session = Depends(get_db)):
    user_email = data.email
    db_user = get_user_by_email(db=db, email=user_email)
    if db_user:
        reset_token = generate_reset_token(user_email) 
        reset_link = f"https://kenzo-a0ml.onrender.com/reset-password?token={reset_token}&email={user_email}"
        
        smtp_host = "smtp.gmail.com"
        smtp_port = 465
        smtp_username = SMTP_USERNAME
        smtp_password = SMTP_PASSWORD
        
        body = f"Follow this link to reset your password: {reset_link} \n It will expire after 20 minutes!"
        
        email = EmailMessage()
        email.set_content(body)
        email['Subject'] = "Password Reset Link"
        email['From'] = smtp_username
        email['To'] = user_email
        
        try:
            server = smtplib.SMTP_SSL(smtp_host, smtp_port)
            server.login(smtp_username, smtp_password)
            server.send_message(email)
            server.quit()
            
            return {"message": "Password reset link sent successfully"}
        except Exception as e:
            print("Error sending email:", str(e))
            raise HTTPException(status_code=500, detail="Failed to send email")
    elif db_user == None:
        raise HTTPException(status_code=504, detail="Failed, can't find this email address!")
        
    
@userRouter.get("/reset-password-verify")
async def reset_password(token: str, email: str):
    if verify_reset_token(token, email):
        
        return {"message": "Reset password allowed"}
    else:
        raise HTTPException(status_code=400, detail="Invalid or expired token")



@userRouter.post("/change-password")
async def change_password(data: userModel.ChangePasswordRequest, db: Session = Depends(get_db)):
    if verify_reset_token(data.token, data.email):
        user = get_user_by_email(db=db, email=data.email)
        if user:
            hashed_password = get_password_hash(data.new_password)
            user.password = hashed_password
            db.commit()
            return {"message": "Password changed successfully"}
        else:
            raise HTTPException(status_code=404, detail="User not found")
    else:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

@userRouter.post("/send-otp-code")
async def request_reset_password(data: userModel.RequestFormFromVerifEmail, db: Session = Depends(get_db)):
    user_email = data.email
    db_user = get_user_by_email(db=db, email=user_email)
    # if db_user != None:
    #     raise HTTPException(status_code=502, detail="Failed, this email already exists!")
    if data.condition == 'exists':
        if db_user != None:
            raise HTTPException(status_code=502, detail="Failed, this email already exists!")
    elif data.condition == 'not_exists':
        if db_user == None:
            raise HTTPException(status_code=502, detail="Failed, this email does not exist!")
    else:
        raise HTTPException(status_code=504, detail="Failed, try again!")
    
    otp_code = generate_reset_code(data.code_length) 
    
    smtp_host = "smtp.gmail.com"
    smtp_port = 465
    smtp_username = SMTP_USERNAME
    smtp_password = SMTP_PASSWORD
    
    body = f"{data.email_message}: {otp_code}"
    
    email = EmailMessage()
    email.set_content(body)
    email['Subject'] = data.email_subject
    email['From'] = smtp_username
    email['To'] = user_email
    
    try:
        server = smtplib.SMTP_SSL(smtp_host, smtp_port)
        server.login(smtp_username, smtp_password)
        server.send_message(email)
        server.quit()
        
        # logic for updating the reset code in the database
        
        return {"message": "OTP code sent successfully", "check": otp_code}
    except Exception as e:
        print("Error sending email:", str(e))
        raise HTTPException(status_code=500, detail="Failed to send email")


@userRouter.patch("/settings/update_user_data")
async def update_user_settings(
    form_data: userModel.OAuth2ChangeUserDataForm = Depends(),
    form_data_password: userModel.VerifyPassword = Depends(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id
    db_user = get_user_by_id(db=db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if form_data.email:
        db_user.email = form_data.email
    if form_data.username:
        db_user.username = form_data.username
    if form_data.password:
       user = userController.authenticate_user(
        db=db,
        username=current_user.username,
        password=form_data_password.password_old
    )
       if not user:
           raise HTTPException(status_code=307, detail="Incorrect user password!")
       
       hashed_password = get_password_hash(form_data.password)
       db_user.password = hashed_password
    if form_data.first_name:
        db_user.first_name = form_data.first_name
    if form_data.last_name:
        db_user.last_name = form_data.last_name
    if form_data.gender:
        db_user.gender = form_data.gender
    if form_data.country:
        db_user.country = form_data.country
    if form_data.city:
        db_user.city = form_data.city
    if form_data.avatar:
        db_user.avatar = form_data.avatar
    if form_data.headerImg:
        db_user.headerImg = form_data.headerImg
    if form_data.user_status:
        db_user.user_status = form_data.user_status
    if form_data.date:
        db_user.date = form_data.date
    if isinstance(form_data.twoAuth, bool):
        db_user.twoAuth = form_data.twoAuth

    db.commit()
    db.refresh(db_user)
    return {"user": db_user}


@userRouter.patch('/settings/change_password')
async def settings_change_password(db: Session = Depends(get_db), form_data: userModel.OAuth2PasswordRequestFormSignin = Depends()):
    user = userController.authenticate_user(
        db=db,
        username=form_data.username,
        password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=307, detail="Incorrect user password!")
    

@userRouter.post("/mark_as_read/")
async def mark_message_as_read(request: userModel.MarkAsReadRequest, 
                               db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_id = current_user.id
    db_user = get_user_by_id(db=db, user_id=user_id)
    message_id = request.message_id

    cached_status = get_message_read_status(message_id)

    if cached_status is not None:
        return {"message": "Message status is already cached.", "is_read": cached_status == "True"}

    message = db.query(Message).filter(Message.id == message_id).first()

    if message:
        message.is_read = True

        db.commit()
        
        set_message_read_status(message_id, True)  
    else:
        return {"message": "Message not found."}

    # Верните успешный ответ
    return {"message": "Message status updated in cache and database."}   
    
@userRouter.get("/api/get_selected_user")
async def get_profile_user(username: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user is None:
        return {"message": "Not authorized"}, 303
    else:
        selected_user = db.query(User).filter_by(username=username).first()
        if selected_user is None:
            raise HTTPException(status_code=308, detail="Can't find selected user!")
        return {     
            "selected_user": {
            "id": selected_user.id,
            "email": selected_user.email,
            "username": selected_user.username,
            "first_name": selected_user.first_name,
            "gender": selected_user.gender,
            "date": selected_user.date,
            "avatar": selected_user.avatar,
            "last_name": selected_user.last_name,
            "country": selected_user.country,
            "city": selected_user.city,
            "user_status": selected_user.user_status,
            "date_reg": selected_user.date_reg,
            "headerImg": selected_user.headerImg,
            "is_Active": selected_user.is_Active,
            }}


@userRouter.post("/api/upload_picture")
async def upload_picture(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    form_data: userModel.PictureRequestForm = Depends()
    ):
    if current_user is None:
        return {"message": "Not authorized"}, 303
    else:
        new_picture = Picture(
            username=form_data.username,
            picture_url=form_data.picture_url,
        )
        picture = create_picture(db=db, picture=new_picture)
        
        return {"Picture": picture}
    
    
@userRouter.get("/api/get_picture")
async def get_picture(
    username: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    ):
    if current_user is None:
        return {"message": "Not authorized"}, 303
    else:
        # if (username):
        #     raise HTTPException(status_code=309, detail="Can't find selected user pictures!")
        # else:
        pictures = db.query(Picture).filter_by(username=username).all()
        user_data = db.query(User).filter_by(username=username).one()
        picture_data = [{"picture_url": picture.picture_url, "date_picture": picture.date_picture, 
                        "username": picture.username, "first_name": user_data.first_name, "last_name": user_data.last_name,
                        "avatar": user_data.avatar, "likes": picture.likes, "id": picture.id} for picture in pictures]
        return {"Pictures": picture_data}


@userRouter.post('/api/like_picture')
async def like_or_unlike_picture(
    picture_id: int = Body(..., embed=True),
    like: bool = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_picture = get_picture_by_id(db=db, picture_id=picture_id)

    if not db_picture:
        raise HTTPException(status_code=404, detail="Picture not found")

    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    if like:
        db_picture.likes += 1
    else:
        db_picture.likes -= 1

    db.commit()
    db.refresh(db_picture)

    return {"picture": db_picture}

@userRouter.post('/api/create_like')
async def like_or_unlike_picture(
    type_like: str = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    form_data: userModel.LikesRequestForm = Depends()
):
    if current_user is None:
        return {"message": "Not authorized"}, 303
    
    if form_data.post_id and form_data.owner_username:
        if type_like == 'picture':
            db_picture = get_picture_by_id(db=db, picture_id=form_data.post_id)
            db_picture_in_likes = get_picture_by_id_in_likes(db=db, post_id=form_data.post_id)
            if db_picture is None:
                return {"message": "Can't find post"}, 303
            
            if db_picture_in_likes:
                like = delete_like(db=db, post_id=form_data.post_id)
                return {"like": like}
            else:
                new_like = Like(
                    owner_username=form_data.owner_username,
                    liker_username=current_user.username,
                    post_id=form_data.post_id,
                    like=form_data.like,
                )
                like = create_like(db=db, like=new_like)
                return {"like": like}
        elif type_like == 'post':
            pass
    else:
        return {"message": "Can't find post"}, 410
    

@userRouter.get('/api/search_like')
async def like_or_unlike_picture(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user is None:
        return {"message": "Not authorized"}, 303
    
    if post_id:
        db_picture_in_likes = get_picture_by_id_in_likes(db=db, post_id=post_id)
        if db_picture_in_likes is None:
            return {"message": None}
        return {"message": db_picture_in_likes}
    else:
        return {"message": "Can't find post"}, 410