import json
from typing import Generator, Iterable, List, Literal, Optional
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel


router = APIRouter(prefix="/users")


class ReadUserResponse(BaseModel):
    user_id: str
    name: str


@router.get(
    path="/{user_id}",
    description="""
    A function that reads a user based on the provided user ID.

    Parameters:
        user_id (int): The ID of the user.

    Returns:
        ReadUserResponse: The response containing the user ID and name.
    """,
)
def read_user(user_id: str) -> ReadUserResponse:
    return ReadUserResponse(user_id=user_id, name="test")


class Message(BaseModel):
    id: str
    text: str
    is_user: bool



class ReadUserMessagesResponse(BaseModel):
    messages: List[Message]


@router.get(
    path="/{user_id}/messages",
    description="""
    Read user messages.

    Args:
        user_id (int): The ID of the user.

    Returns:
        ReadUserMessagesResponse: An instance of the ReadUserMessagesResponse
            class containing the user messages.

    Raises:
        None.

    Description:
        This function is used to read user messages. It takes the user ID as
        input and returns an instance of the ReadUserMessagesResponse class
        containing the user messages.
    """,
)
def read_user_messages(
    user_id: str,
    order: Optional[Literal["asc", "desc"]] = None,
    limit: Optional[int] = None,
    after: Optional[str] = None,
    before: Optional[str] = None,
) -> ReadUserMessagesResponse:
    # TODO: implement read user messages
    return ReadUserMessagesResponse(
        messages=[Message(id="dsadd", text="test", is_user=True)]
    )


class CreateUserMessageInput(BaseModel):
    text: Optional[str] = None
    file_url: Optional[str] = None


class CreateUserMessageResponse(BaseModel):
    success: bool
    code: int


@router.post(
    path="/{user_id}/messages",
    description="""
    Create a new message for a user.

    Args:
        user_id (int): The ID of the user.
        input (CreateUserMessageInput): The input data for creating the user message.

    Returns:
        ReadUserMessagesResponse: The response containing the user's updated messages.
    """,
)
def create_user_message(
    user_id: str, input: CreateUserMessageInput
) -> CreateUserMessageResponse:
    # TODO: implement create user message
    return CreateUserMessageResponse(success=True, code=200)

class MessageEvent(BaseModel):
    event:Literal["create","update","delete"]
    message:Message
    
@router.get(
    path="/{user_id}/messages/subscribe",
    description="""
    Subscribe to user messages.

    This function subscribes to user messages for a given user ID. It returns a generator that yields messages as they are received.

    :param user_id: The ID of the user to subscribe to messages.
    :type user_id: int
    :return: A generator that yields Message objects.
    :rtype: Generator[Message, None, None]
    """,
)
def subscribe_user_messages(user_id: str) -> Iterable[str]:
    def gen():
        # TODO: implement subscribe user messages
        messages_events = [MessageEvent(event="create",message=Message(id="dsadaaaa", text="testss",is_user=True)).json(),MessageEvent(event="create",message=Message(id="22222", text="testdddss",is_user=True)).json()]
        for message_event in messages_events:
            print(message_event)
            yield json.dumps(message_event) + "\n" 

    return StreamingResponse(content=gen(), media_type="text/event-stream")


class SaveUserItineraryInput(BaseModel):
    content: str


class SaveUserItineraryResponse(BaseModel):
    status: int
    success: bool
    itinerary_id: str


@router.post(
    path="/{user_id}/itineraries",
    description="""
    Saves a user's itinerary.

    Args:
        user_id (int): The ID of the user.
        input (SaveUserItineraryInput): The input data for saving the user's itinerary.

    Returns:
        SaveUserItineraryResponse: The response containing the status, success flag, and itinerary ID.
    """,
)
def save_user_itinerary(
    user_id: str, input: SaveUserItineraryInput
) -> SaveUserItineraryResponse:
    # TODO: implement save user itinerary
    return SaveUserItineraryResponse(status=200, success=True, itinerary_id="test")


class SaveUserLocationInput(BaseModel):
    latitude: float
    longitude: float


class SaveUserLocationResponse(BaseModel):
    status: int
    success: bool


@router.post(
    path="/{user_id}/locations",
    description="""
    Save a user's location.

    Args:
        user_id (int): The ID of the user.
        input (SaveUserLocationInput): The input data for saving the user's location.

    Returns:
        SaveUserItineraryResponse: The response object indicating the status and success of saving the user's location.
    """,
)
def save_user_location(
    user_id: str, input: SaveUserLocationInput
) -> SaveUserItineraryResponse:
    # TODO: implement save user location

    return SaveUserLocationResponse(status=200, success=True)
