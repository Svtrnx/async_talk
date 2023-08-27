from fastapi import FastAPI
from model import userModel
from database.connection import engine
from routes import userRoute
from fastapi.middleware.cors import CORSMiddleware
import os

#config DB
userModel.Base.metadata.create_all(bind=engine)


# Instance
app = FastAPI()


origins = [    
    "http://localhost:3000",
    # "http://localhost:3000/",
    # "http://localhost:3000",
    # "https://res.cloudinary.com",
    # "https://cloudinary.com",
    # "http://127.0.0.1:3000",
    # "https://youngkenzo.netlify.app/",
    ] 

app.add_middleware(
    CORSMiddleware,
    allow_origins=['https://youngkenzo.netlify.app/'],
    allow_credentials=True,
    allow_methods=["GET, POST, PUT, DELETE, UPDATE"],
    allow_headers=[
        "Accept",
        "Accept-Encoding",
        "Authorization",
        "Content-Type",
        "DNT",
        "Origin",
        "User-Agent",
        "x-requested-with",
        # Добавьте сюда другие заголовки, которые вам нужны
    ],
    expose_headers=["Content-Length", "Content-Range"],  # Дополнительные заголовки, доступные для чтения фронтендом
)

# config routes
app.include_router(userRoute.userRouter)










