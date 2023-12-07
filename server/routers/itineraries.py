from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(prefix="/itineraries")


class Itinerary(BaseModel):
    itinerary_id: str
    content: str
@router.get(path="/{itinerary_id}")
def read_itinerary(itinerary_id: str)->Itinerary:
    return Itinerary(itinerary_id="test",content="test")