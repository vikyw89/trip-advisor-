import os
from typing import Generator
from redis import  Redis
from dotenv import load_dotenv
from typings.index import MessageEvent

load_dotenv()
r = Redis.from_url(os.getenv('REDIS_URL'))

class PubSub:
    def __init__(self, user_id:str, trip_id: str) -> None:
        self.trip_id = trip_id
        self.user_id = user_id

    def publish(self, event: MessageEvent) -> int:
        print("publish", event)
        return r.publish(self.trip_id, event.json())

    def subscribe(self) -> Generator[str, None, None]:
        pubsub = r.pubsub()
        pubsub.subscribe(self.trip_id)
        for event in pubsub.listen():
            if event["type"] == "message":
                print("subscribe-event",event)
                yield event["data"]
