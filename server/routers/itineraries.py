from typing import List
from fastapi import APIRouter
from pydantic import BaseModel
from libs.prisma.index import db

router = APIRouter(prefix="/itineraries")

class Itinerary(BaseModel):
    itinerary_id: str
    content: str
@router.get(path="/{itinerary_id}")
def read_itinerary(itinerary_id: str)->Itinerary:
    # TODO: implement read user trip itinerary
    itinerary_from_db = db.itinerary.find_unique(
        where={"id": itinerary_id}
    )
    return Itinerary(itinerary_id=itinerary_from_db.id,content=itinerary_from_db.content)

