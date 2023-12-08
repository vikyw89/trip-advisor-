from openai import OpenAI
import instructor
from openai import AsyncOpenAI
from pydantic import BaseModel
from openai.types.chat.chat_completion_message_param import ChatCompletionMessageParam
client = instructor.patch(OpenAI())

response = client.chat.completions.create(
  model="gpt-3.5-turbo-1106",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Who won the world series in 2020?"},
    {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
    {"role": "user", "content": "Where was it played?"}
  ]
)

# we will have several AI for different function
# each AI goal is to aquire enough data from user to output a function call


class ChatAssistant:
    def __init__(self, trip_id:str) -> None:
        # retrieve user previous messages
        from libs.prisma.index import db
        
        self.user = db.trip.find_unique(where={"id": trip_id}).user
        pass
    
    def chat(self, message:str) -> str:
        user = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": "Extract Jason is 25 years old"},
            ]
    def _stage_checker(self, message:str) -> str:
        
        
class TripPurposeAssistant:
    def __init__(self) -> None:
        pass
    
    def chat(self, message:str) -> str:
        user = client.chat.completions.create(
            model="gpt-3.5-turbo",
            response_model=UserDetail,
            messages=[
                {"role": "user", "content": "Extract Jason is 25 years old"},
            ]
)
        return response