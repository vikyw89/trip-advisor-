import datetime
import json
from typing import Generator, Iterable, List, Literal, Optional
import uuid
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from libs.redis.index import PubSub
from typings.index import Itinerary, Message, MessageEvent
from libs.prisma.index import db
from libs.vertexAI.TrueLens import GenerateChat

router = APIRouter(prefix="/users")
generate_chat = GenerateChat()  # Instantiate GenerateChat class


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


class ReadUserMessagesResponse(BaseModel):
    messages: List[Message]


@router.get(
    path="/{user_id}/trips/{trip_id}/messages",
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
    order: Optional[Literal["asc", "desc"]] = "asc",
    limit: Optional[int] = 20,
    after: Optional[str] = None,
    before: Optional[str] = None,
    trip_id: Optional[str] = None,
) -> ReadUserMessagesResponse:
    # get user messages from DB
    # TODO: implement customizable pagination
    trip_messages = db.trip.find_unique(
        where={"id": trip_id},
        include={"messages": {"take": limit, "order_by": {"createdAt": order}}},
    )
    # parse messages
    messages = []

    for message in trip_messages.messages:
        # some additional parsing ?
        messages.append(
            Message(
                id=message.id,
                text=message.content,
                is_user=False if message.isBot else True,
            )
        )

    return ReadUserMessagesResponse(messages=messages)


from prisma.models import Trip


class ReadUserTripsResponse(BaseModel):
    trips: List[Trip]


@router.get(
    path="/{user_id}/trips",
    description="""
            Read trips that belong to a user
            """,
)
def read_user_trips(
    user_id: str, upcoming: Optional[bool] = None
) -> ReadUserTripsResponse:
    # TODO: read user trips
    trips = []
    # if upcoming
    from datetime import datetime

    if upcoming:
        # we also add trips that has no end date
        trips = db.trip.find_many(
            where={
                "userId": user_id,
                "OR": [
                    {
                        "endDate": {"gt": datetime.now()},
                    },
                    {"endDate": None},
                ],
            }
        )
    else:
        trips = db.trip.find_many(
            where={"userId": user_id, "endDate": {"lt": datetime.now()}}
        )

    return ReadUserTripsResponse(trips=trips)


class CreateUserTripResponse(BaseModel):
    success: bool
    code: int
    tripId: str


@router.post(
    path="/{user_id}/trips",
    description="""
             Create a new trip for a user
             """,
)
def create_user_trip(user_id: str) -> CreateUserTripResponse:
    # TODO: create user trip
    create_user_trip_response = db.trip.create(
        data={"userId": user_id},
    )
    print(create_user_trip_response)
    return CreateUserTripResponse(
        code=200, success=True, tripId=create_user_trip_response.id
    )


class CreateUserMessageInput(BaseModel):
    text: Optional[str] = None
    file_url: Optional[str] = None


class CreateUserMessageResponse(BaseModel):
    success: bool
    code: int


@router.post(
    path="/{user_id}/trips/{trip_id}/messages",
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
    user_id: str, trip_id: str, input: CreateUserMessageInput
) -> CreateUserMessageResponse:
    # add message to db
    pubsub = PubSub(user_id=user_id, trip_id=trip_id)

    # publish messages to pubsub
    pubsub.publish(
        MessageEvent(
            event="create",
            message=Message(
                id=str(uuid.uuid4()),
                text=input.text,
                is_user=True,
            ),
        )
    )

    save_message_response = db.message.create(
        data={
            "content": input.text,
            "tripId": trip_id,
            "isBot": False,
        },
        include={"Trip": True},
    )

    # # delete messages to pubsub
    # pubsub.publish(
    #     MessageEvent(
    #         event="delete",
    #         message=Message(
    #             id="draft",
    #             text=save_message_response.content,
    #             is_user=True,
    #         ),
    #     )
    # )
    # # create user message with correct uuid
    # pubsub.publish(
    #     MessageEvent(
    #         event="delete",
    #         message=Message(
    #             id=save_message_response.id,
    #             text=save_message_response.content,
    #             is_user=True,
    #         ),
    #     )
    # )

    # TODO: implement AI streaming response
    # create an empty message

    pubsub.publish(
        MessageEvent(
            event="create", message=Message(id="streaming", text="", is_user=False)
        )
    )
    chat_response = generate_chat.generate(input_text=input.text,trip_id=trip_id)

    def streaming():
        message_to_stream = chat_response
        for character in message_to_stream:
            yield character

    complete_message = chat_response
    for stream in streaming():
        complete_message += stream
        # dummy response for the moment
        pubsub.publish(
            MessageEvent(
                event="update",
                message=Message(id="streaming", text=complete_message, is_user=False),
            )
        )

    # after streaming finishes, we store the ai complete message in db
    save_ai_response = db.message.create(
        data={
            "content": "put streaming response here",
            "tripId": trip_id,
            "isBot": True,
        },
        include={"Trip": True},
    )

    # publish ai complete response to pubsub, update the message ID
    pubsub.publish(
        MessageEvent(
            event="delete",
            message=Message(id="streaming", text="delete", is_user=False),
        )
    )

    pubsub.publish(
        MessageEvent(
            event="create",
            message=Message(
                id=save_ai_response.id, text=save_ai_response.content, is_user=False
            ),
            is_user=False,
        )
    )

    # return successfull mutation
    return CreateUserMessageResponse(success=True, code=200)


@router.get(
    path="/{user_id}/trips/{trip_id}/messages/subscribe",
    description="""
    Subscribe to user messages.

    This function subscribes to user messages for a given user ID. It returns a generator that yields messages as they are received.

    :param user_id: The ID of the user to subscribe to messages.
    :type user_id: int
    :return: A generator that yields Message objects.
    :rtype: Generator[Message, None, None]
    """,
)
def subscribe_user_messages(user_id: str, trip_id: str) -> Iterable[str]:
    def gen():
        # TODO: implement subscribe user messages
        events = PubSub(user_id=user_id, trip_id=trip_id)
        for message_event in events.subscribe():
            print(message_event)
            yield json.dumps(message_event) + "\n"

    return StreamingResponse(content=gen(), media_type="text/event-stream")


# class SaveUserItineraryInput(BaseModel):
#     content: str


# class SaveUserItineraryResponse(BaseModel):
#     status: int
#     success: bool
#     itinerary_id: str


# @router.post(
#     path="/{user_id}/itineraries",
#     description="""
#     Saves a user's itinerary.

#     Args:
#         user_id (int): The ID of the user.
#         input (SaveUserItineraryInput): The input data for saving the user's itinerary.

#     Returns:
#         SaveUserItineraryResponse: The response containing the status, success flag, and itinerary ID.
#     """,
# )
# def save_user_itinerary(
#     user_id: str, input: SaveUserItineraryInput
# ) -> SaveUserItineraryResponse:
#     # TODO: implement save user itinerary
#     return SaveUserItineraryResponse(status=200, success=True, itinerary_id="test")


# class SaveUserLocationInput(BaseModel):
#     latitude: float
#     longitude: float


# class SaveUserLocationResponse(BaseModel):
#     status: int
#     success: bool


# @router.post(
#     path="/{user_id}/locations",
#     description="""
#     Save a user's location.

#     Args:
#         user_id (int): The ID of the user.
#         input (SaveUserLocationInput): The input data for saving the user's location.

#     Returns:
#         SaveUserLocationResponse: The response object indicating the status and success of saving the user's location.
#     """,
# )
# def save_user_location(
#     user_id: str, input: SaveUserLocationInput
# ) -> SaveUserLocationResponse:
#     # TODO: implement save user location

#     return SaveUserLocationResponse(status=200, success=True)
def test_chat_generation(
  input: CreateUserMessageInput, trip_id:Optional[str] = None
) -> dict:
    # TODO: implement AI streaming response
    # create an empty message
    chat_response = generate_chat.generate(input_text=input.text,trip_id=trip_id)

    return {"chat_response": chat_response}