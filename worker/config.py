import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    REDIS_HOST = os.getenv('REDIS_HOST')
    REDIS_PORT = os.getenv('REDIS_PORT')
    QUEUE_NAME = 'image-queue'
    CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
    API_KEY = os.getenv('CLOUDINARY_API_KEY')
    API_SECRET = os.getenv('CLOUDINARY_API_SECRET')
    MONGODB_URI = os.getenv('MONGODB_URI')
    TOPIC_NAME = os.getenv('TOPIC_NAME')
