from typing import Literal
from pydantic import BaseModel


class Message(BaseModel):
    id: str
    text: str
    is_user: bool
    
class MessageEvent(BaseModel):
    event:Literal["create","update","delete"]
    message:Message
    
class Itinerary(BaseModel):
    itinerary_id: str
    content: str