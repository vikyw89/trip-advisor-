import os
from dotenv import load_dotenv
from fastapi import FastAPI
from routers import itineraries, locations, messages,users

# init
load_dotenv()
app = FastAPI()

# routers
app.include_router(router=itineraries.router)
app.include_router(router=locations.router)
app.include_router(router=messages.router)
app.include_router(router=users.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}

