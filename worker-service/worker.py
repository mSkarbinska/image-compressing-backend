import sys
import redis
import json
from pymongo import MongoClient
from cloudinary import uploader, config
from PIL import Image
import io
from dotenv import load_dotenv
import os
import requests
from bson import ObjectId
import traceback

load_dotenv()


class Config:
    REDIS_HOST = os.getenv('REDIS_HOST')
    REDIS_PORT = os.getenv('REDIS_PORT')
    QUEUE_NAME = 'image-queue'
    CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
    API_KEY = os.getenv('CLOUDINARY_API_KEY')
    API_SECRET = os.getenv('CLOUDINARY_API_SECRET')
    MONGO_URL = os.getenv('MONGODB_URI')


class MongoDB:
    def __init__(self, mongo_url):
        self.client = MongoClient(mongo_url)
        self.imagesCollection = self.client.test.imagemetadatas
        self.tasksCollection = self.client.test.compressingtasks

    @staticmethod
    def update_field_by_id(collection, object_id, field_name, new_field_value):
        objects_filter = {"_id": ObjectId(object_id)}
        update = {"$set": {field_name: new_field_value}}
        result = collection.update_one(objects_filter, update)

        if result.modified_count > 0:
            print(f'Field {field_name} updated successfully.')
        else:
            print("No matching document found or the field value was the same.")


class ImageProcessor:
    @staticmethod
    def download_image(image_url):
        response = requests.get(image_url)
        return response.content

    @staticmethod
    def compress_image(image_bytes):
        image = Image.open(io.BytesIO(image_bytes))
        image = image.convert("RGB")

        compressed_image_bytes = io.BytesIO()
        image.save(compressed_image_bytes, format='JPEG', quality=70)

        return compressed_image_bytes.getvalue()

    @staticmethod
    def upload_compressed_image(image_data):
        config(
            cloud_name=Config.CLOUD_NAME,
            api_key=Config.API_KEY,
            api_secret=Config.API_SECRET
        )

        result = uploader.upload(image_data, folder='compressed_images')
        return result['secure_url']


class MessageProcessor:
    @staticmethod
    def deserialize_message(message):
        message = message.decode('utf-8')
        message_object = json.loads(message)
        image_url = message_object['imageUrl']
        task_id = message_object['taskId']
        image_id = message_object['imageId']
        return image_url, task_id, image_id


def worker_function(redis_host, redis_port, queue_name, mongo_url):
    redis_client = redis.Redis(host=redis_host, port=redis_port)
    mongo = MongoDB(mongo_url)

    print("Worker started.")

    while True:
        task_id = None
        try:
            _, queue_item = redis_client.blpop(queue_name)

            if queue_item is not None:
                image_url, task_id, image_id = MessageProcessor.deserialize_message(queue_item)

                print(f"Received message: {image_url} {task_id} {image_id}")

                image_bytes = ImageProcessor.download_image(image_url)
                compressed_image_bytes = ImageProcessor.compress_image(image_bytes)
                compressed_image_url = ImageProcessor.upload_compressed_image(compressed_image_bytes)

                mongo.update_field_by_id(mongo.imagesCollection, image_id, 'compressedUrl', compressed_image_url)
                mongo.update_field_by_id(mongo.tasksCollection, task_id, 'status', 'completed')
        except KeyboardInterrupt:
            print("Received KeyboardInterrupt. Exiting gracefully.")
            sys.exit(0)
        except Exception as e:
            print(f"Error occurred while processing the image: {e}")
            traceback.print_exc()

            # update the task status to 'failed'
            try:
                if task_id is not None:
                    mongo.update_field_by_id(mongo.tasksCollection, task_id, 'status', 'failed')
            except Exception as db_error:
                print(f"Error occurred while updating the task status in the database: {db_error}")
                traceback.print_exc()


if __name__ == '__main__':
    worker_function(Config.REDIS_HOST, Config.REDIS_PORT, Config.QUEUE_NAME, Config.MONGO_URL)

    # num_workers = multiprocessing.cpu_count()
    # processes = []

    # for _ in range(num_workers):
    #     p = multiprocessing.Process(target=worker_function)
    #     processes.append(p)
    #     p.start()

    # for p in processes:
    #     p.join()
