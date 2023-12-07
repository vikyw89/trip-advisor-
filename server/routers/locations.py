from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(prefix="/locations")


class ReadLocationResponse(BaseModel):
    location_name: str
@router.get("/{location_name}")
def read_location(location_name: str) -> dict:
    # TODO: implement read location
    from libs.places.index import Location
    location = Location()
    return location.text_search(query=location_name)

