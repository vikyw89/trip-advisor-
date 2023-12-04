from typing import Generator, List
from fastapi import APIRouter, Form, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel


router = APIRouter(prefix="/users")


class ReadUserResponse(BaseModel)
    user_id: int
    name: str
    
@router.get(path="/{user_id}")
def read_user(user_id: int) -> ReadUserResponse:
    return {"user_id": user_id,"name":"test"}

class Message(BaseModel):
    id: str
    text: str
    file_url: str

class ReadUserMessagesResponse(BaseModel):
    messages:List[Message]
    
@router.get(path="/{user_id}/messages")
def read_user_messages(user_id: int) -> ReadUserMessagesResponse:
    # TODO: implement read user messages
    return ReadUserMessagesResponse(messages=[Message(id="dsadd",text="test",file_url="test")])

class CreateUserMessageInput(BaseModel):
    id:str
    text:str
    file_url:str
    
@router.post(path="/{user_id}/messages")
def create_user_message(user_id: int,input=CreateUserMessageInput) -> ReadUserMessagesResponse:
    # TODO: implement create user message
    return ReadUserMessagesResponse(messages=[Message(id=1,text="test",file_url="test")])

    
@router.get(path="/{user_id}/messages/subscribe")
def subscribe_user_messages(user_id: int) -> Generator[Message, None, None]:
    def gen():
        # TODO: implement subscribe user messages
        messages = []
        for message in messages:
            yield message
    
    return StreamingResponse(gen(), media_type="text/event-stream")