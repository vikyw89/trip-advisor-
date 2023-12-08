import json
from typing import List
from fastapi import APIRouter
from pydantic import BaseModel, Json


router = APIRouter(prefix="/locations")

class Location(BaseModel):
    latitude: float
    longitude: float

class Viewport(BaseModel):
    low: Location
    high: Location

class AddressComponent(BaseModel):
    longText: str
    shortText: str
    types: List[str]
    languageCode: str

class AuthorAttribution(BaseModel):
    displayName: str
    uri: str
    photoUri: str

class Photo(BaseModel):
    name: str
    widthPx: int
    heightPx: int
    authorAttributions: List[AuthorAttribution]

class Place(BaseModel):
    name: str
    id: str
    types: List[str]
    formattedAddress: str
    addressComponents: List[AddressComponent]
    location: Location
    viewport: Viewport
    googleMapsUri: str
    utcOffsetMinutes: int
    adrFormatAddress: str
    iconMaskBaseUri: str
    iconBackgroundColor: str
    displayName: dict
    shortFormattedAddress: str
    photos: List[Photo]

class ReadLocationResponse(BaseModel):
    places: List[Place]
    
@router.get("/{location_name}")
def read_location(location_name: str) ->ReadLocationResponse:
    # check cache
    from libs.redis.index import Cache
    r = Cache()
    cache = r.get(key=f"get/locations/{location_name}")
    if cache:
        return ReadLocationResponse.validate(value=json.loads(cache))
    
    from libs.places.index import Location
    location = Location()
    response = location.text_search(query=location_name)
    
    # save cache
    saved_cache = r.set(key=f"get/locations/{location_name}", value=json.dumps(response))

    return ReadLocationResponse.validate(value=response)
