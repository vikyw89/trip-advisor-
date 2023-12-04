from fastapi import APIRouter


router = APIRouter(prefix="/itineraries")

@router.get("")