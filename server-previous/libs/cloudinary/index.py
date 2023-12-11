
# Set your Cloudinary credentials
# ==============================
from dotenv import load_dotenv
from pydantic import BaseModel
load_dotenv()

# Import the Cloudinary libraries
# ==============================
import cloudinary
import cloudinary.uploader
import cloudinary.api

# Import to format the JSON responses
# ==============================
import json
import os

# Set configuration parameter: return "https" URLs by setting secure=True  
# ==============================
config = cloudinary.config(secure=True)
load_dotenv()

CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

print(CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_SECRET)
if not CLOUDINARY_API_KEY or not CLOUDINARY_CLOUD_NAME or not CLOUDINARY_API_SECRET:
    raise Exception(
        "CLOUDINARY_API_KEY or CLOUDINARY_CLOUD_NAME or CLOUDINARY_API_SECRET is not set"
    )


class UploadImageResponse(BaseModel):
    imageUrl: str
    placeholderUrl: str
    
class Cloudinary:
    def __init__(self):
        self.cloudinary = cloudinary.config(
            cloud_name=CLOUDINARY_CLOUD_NAME,
            api_key=CLOUDINARY_API_KEY,
            api_secret=CLOUDINARY_API_SECRET,
        )

    def uploadImage(self, file_url=str, file_name=str) -> UploadImageResponse:
        # Upload the image and get its URL
        # ==============================

        # Upload the image.
        # Set the asset's public ID and allow overwriting the asset with new versions
        cloudinary.uploader.upload(file_url, public_id=file_name, unique_filename = False, overwrite=True)

        # Build the URL for the image and save it in the variable 'srcURL'
        srcURL = cloudinary.CloudinaryImage(file_name).build_url()
        print(srcURL)
        # Log the image URL to the console. 
        # Copy this URL in a browser tab to generate the image on the fly.
        return UploadImageResponse(imageUrl=srcURL, placeholderUrl=srcURL)
