import json
from typing import List
from fastapi import APIRouter
from pydantic import BaseModel, Json
from prisma.models import Photo

router = APIRouter(prefix="/photos")

class ReadPhotoInput(BaseModel):
    photo_name: str
    
@router.post("/retrieve_url")
def read_photo(input:ReadPhotoInput) -> Photo:
    # check cache
    from libs.redis.index import Cache

    r = Cache()
    cache = r.get(key=f"get/photos/{input.photo_name}")
    
    if cache:
        return Photo.validate(value=json.loads(cache))

    from libs.places.index import Location

    location = Location()
    photo : Photo = location.read_photo_url(photo_name=input.photo_name)

    # save cache
    saved_cache = r.set(
        key=f"get/locations/{input.photo_name}", value=photo.json()
    )

    return photo
