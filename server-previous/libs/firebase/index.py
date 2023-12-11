import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage
from dotenv import load_dotenv
import os

RAW_FIREBASE_SERVICE_KEY = os.getenv("FIREBASE_SERVICE_KEY")
if not RAW_FIREBASE_SERVICE_KEY:
    raise Exception("FIREBASE_SERVICE_KEY is not set")

FIREBASE_SERVICE_KEY = json.loads(RAW_FIREBASE_SERVICE_KEY)

cred = credentials.Certificate(FIREBASE_SERVICE_KEY)
firebase_admin.initialize_app(cred, {
    'storageBucket': 'ai-app-6dea5.appspot.com'
})

bucket = storage.bucket()

# def upload_blob(bucket_name, source_file_name, destination_blob_name):
#     credentials = service_account.Credentials.from_service_account_file("path/to/your/credentials.json")
#     storage_client = storage.Client(credentials=credentials)
#     bucket = storage_client.bucket(bucket_name)
#     blob = bucket.blob(destination_blob_name)
#     blob.upload_from_filename(source_file_name)
#     print(f"File {source_file_name} uploaded to {destination_blob_name}.")
# upload_blob(firebase_admin.storage.bucket().name, 'sample_image_file.jpg', 'images/beatiful_picture.jpg')