import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from routers import itineraries, locations, messages,users
from fastapi.middleware.cors import CORSMiddleware

# init
load_dotenv()
app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost",
    "http://localhost:8080",
    "https://trip-advisor-tlq4.vercel.app/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# routers
app.include_router(router=itineraries.router)
app.include_router(router=locations.router)
app.include_router(router=messages.router)
app.include_router(router=users.router)

@app.get("/")
def read_root():
    response = RedirectResponse(url="/docs")
    return response

