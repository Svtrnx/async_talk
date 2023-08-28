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


# origins = [    
#     "http://localhost:3000",
#     # "http://localhost:3000/",
#     # "http://localhost:3000",
#     # "https://res.cloudinary.com",
#     # "https://cloudinary.com",
#     # "http://127.0.0.1:3000",
#     # "https://youngkenzo.netlify.app/",
#     ] 

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["https://async-talk.vercel.app", "https://async-talk.vercel.app/", "https://async-talk.vercel.app/signin", "https://async-talk.vercel.app/messenger", "https://async-talk.vercel.app/signup"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# config routes
app.include_router(userRoute.userRouter)










