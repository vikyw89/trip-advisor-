import os
from google.cloud import aiplatform

# env check
GOOGLE_CREDENTIALS = os.getenv("GOOGLE_CREDENTIALS")
if (not GOOGLE_CREDENTIALS):
    raise Exception("GOOGLE_CREDENTIALS not set")

# init client
aiplatform.init(
    # your Google Cloud Project ID or number
    # environment default used is not set
    project="my-project",
    # the Vertex AI region you will use
    # defaults to us-central1
    location="us-central1",
    # Google Cloud Storage bucket in same region as location
    # used to stage artifacts
    staging_bucket="gs://my_staging_bucket",
    # custom google.auth.credentials.Credentials
    # environment default credentials used if not set
    credentials=GOOGLE_CREDENTIALS,
    # customer managed encryption key resource name
    # will be applied to all Vertex AI resources if set
    encryption_spec_key_name=my_encryption_key_name,
    # the name of the experiment to use to track
    # logged metrics and parameters
    experiment="my-experiment",
    # description of the experiment above
    experiment_description="my experiment description",
)

from llama_index.llms.vertex import Vertex
from llama_index.llms.base import ChatMessage, MessageRole, CompletionResponse

llm = Vertex(model="text-bison", temperature=0, additional_kwargs={})
llm.complete("Hello this is a sample text").text

messages = [
    ChatMessage(role=MessageRole.SYSTEM, content="Reply everything in french"),
    ChatMessage(role=MessageRole.USER, content="Hello"),
]

class AI:
    def __init__(self):
        pass
    
    def create_itinerary:
        