from typing import List
from fastapi import APIRouter
from pydantic import BaseModel
from libs.prisma.index import db
from typings.index import Itinerary


router = APIRouter(prefix="/trips")


class ReadTripItinerariesResponse(BaseModel):
    itineraries: List[Itinerary]
    trip_id: str


@router.get(
    path="/{trip_id}/itineraries",
    description="""
    Get a itinerary from a trip""",
)
def read_trip_itineraries(trip_id: str) -> ReadTripItinerariesResponse:
    # TODO: implement read user trip itinerary
    # get itineraries from trip
    trip_from_db = db.trip.find_first(
        where={"id": trip_id}, include={"itinerary": True}
    )

    if not trip_from_db.itinerary:
        return ReadTripItinerariesResponse(
            itineraries=[], trip_id=trip_id
        )
    
    parsed_itineraries = [
        Itinerary(
            itinerary_id=trip_from_db.itinerary.id,
            content=trip_from_db.itinerary.content,
        )
    ]

    return ReadTripItinerariesResponse(itineraries=parsed_itineraries, trip_id=trip_id)
