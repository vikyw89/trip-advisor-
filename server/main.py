import os
from typing import Union
from dotenv import load_dotenv
from fastapi import FastAPI
from server.routers import itineraries, locations, messages,users
load_dotenv()
app = FastAPI()

app.include_router(router=itineraries.router)
app.include_router(router=locations.router)
app.include_router(router=messages.router)
app.include_router(router=users.router)


@app.get("/")
def read_root():
    return {"Hello": "World"}

