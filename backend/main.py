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



app.add_middleware(
    CORSMiddleware,
    # allow_origins=["https://kenzo-a0ml.onrender.com"],
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# config routes
app.include_router(userRoute.userRouter)










