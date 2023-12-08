import json
import os
import re
from typing import Any
from dotenv import load_dotenv
from urllib.parse import quote 
import requests
from prisma.models import Photo
load_dotenv()

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise Exception("GOOGLE_API_KEY is not set")

class Location:
    def __init__(self,api_key=GOOGLE_API_KEY) -> None:
        self.api_key = api_key
    
    def text_search(self, query: str) -> dict:
        url = "https://places.googleapis.com/v1/places:searchText"
        response = requests.post(url=url,
                                 params={
            "textQuery": query
        },headers={
            "content-Type": "application/json",
            "X-Goog-Api-Key":self.api_key,
            "X-Goog-FieldMask": "*"
        })
        return self.parse_response(response.json())

    def read_photo_url(self, photo_name:str) -> Photo:
        url=f"https://places.googleapis.com/v1/{photo_name}/media"

        response = requests.get(url=url,params={
            "key":self.api_key,
            "maxWidthPx":"1024"
        })

        # cache result
        from libs.prisma.index import db
        
        # get actual url
        from libs.cloudinary.index import Cloudinary
        
        cloudinary = Cloudinary()
        file_url = cloudinary.uploadImage(file_url=response.url, file_name=photo_name)

        save_image_response = db.photo.upsert(
            where={
                "id": photo_name,
            },
            data={
                "create":{
                    "id": photo_name,
                    "imageUrl": file_url.imageUrl,
                    "placeholderUrl": file_url.placeholderUrl
                },
                "update":{
                    "imageUrl": file_url.imageUrl,
                    "placeholderUrl": file_url.placeholderUrl
                }
            }
        )
        return save_image_response
    
    
    def parse_response(self, response: dict) -> dict:
        # parse dict into json
        # stringified_response = json.dumps(response)
        # pattern = r'(?P<name_key>"name": ")(?P<name_val>[^\"]*)'

        # def repl(match)->str:
        #     # every match will match one of the groups
        #     if match.group("name_val"):
        #         # check cache
        #         from libs.prisma.index import db
        #         cache = db.photo.find_unique(
        #             where={
        #                 "id": match.group("name_val"),
        #             }
        #         )
                
        #         if cache:
        #             return cache.imageUrl
                
        #         # get blob from google api
        #         blob = self._photo(photo_name=match.group("name_val"))
                
        #         # upload blob to supabase storage
        #         from libs.supabase.index import supabase
        #         file_name = match.group("name_val")
        #         uploaded_file = supabase.storage.from_("photos").upload(path=file_name,file=blob)
                
        #         # get url from supabase storage
        #         image_url = supabase.storage.from_("photos").get_public_url(path=file_name,options={"transform":{"format":"avif"}})
                
        #         # cache result
        #         save_image_response = db.photo.upsert(
        #             where={
        #                 "id": file_name,
        #             },
        #             data={
        #                 "create":{
        #                     "id": file_name,
        #                     "imageUrl": image_url
        #                 },
        #                 "update":{
        #                     "imageUrl": image_url
        #                 }
        #             }
        #         )
                
        #         return f'{match.group("name_key")}{save_image_response.imageUrl}'
            
        # parsed_response = re.sub(pattern=pattern, repl=repl,string=stringified_response)
        return response