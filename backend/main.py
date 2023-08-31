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
#     ] 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://kenzo-a0ml.onrender.com"],
    # allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# config routes
app.include_router(userRoute.userRouter)










