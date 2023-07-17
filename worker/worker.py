import multiprocessing
import redis
import json
import pymongo
from pymongo import MongoClient
import cloudinary
from cloudinary import uploader, CloudinaryImage
from PIL import Image
import io
from dotenv import load_dotenv
import os
import requests

load_dotenv()


def worker_function(redis_host, redis_port, queue_name, cloud_name, api_key, api_secret, mongo_url):
    def update_field_by_id(collection, object_id, field_name, new_field_value):
        filter = {"_id": object_id}
        
        update = {"$set": {field_name: new_field_value}}
        
        result = collection.update_one(filter, update)
        
        if result.modified_count > 0:
            print("Field updated successfully.")
        else:
            print("No matching document found or the field value was the same.")


    def deserialize_message(message):
        message = queue_item.decode('utf-8')
        message_object = json.loads(message)
        image_url = message_object['imageUrl']
        image_name = message_object['imageName']
        task_id = message_object['taskId']
        image_id = message_object['imageDataId']

        return image_url, image_name, task_id, image_id


    redis_client = redis.Redis(host=redis_host, port=redis_port)

    while True:
        _, queue_item = redis_client.blpop(queue_name)
        
        cloudinary.config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret
        )

        client = MongoClient(mongo_url)
        collection = client.db['imagedatas']

        if queue_item is not None:
            print(queue_item)
            image_url, image_name, task_id, image_id = deserialize_message(queue_item)

            print(f"Received message: {image_url} {image_name} {task_id} {image_id}")
            
            response = requests.get(image_url)
            image_bytes = response.content
            
            image = Image.open(io.BytesIO(image_bytes))
            
            image = image.convert("RGB")
            image.save('compressed.jpg', format='JPEG', quality=70)
            
            result = uploader.upload('compressed.jpg', folder='compressed_images')
            compressed_url = result['secure_url']

            update_field_by_id(collection, image_id, 'compressedUrl', compressed_url)
            

        

if __name__ == '__main__':
    load_dotenv()

    redis_host = os.getenv('REDIS_HOST')
    redis_port = os.getenv('REDIS_PORT')

    queue_name = 'image-queue'

    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
    api_key = os.getenv('CLOUDINARY_API_KEY')
    api_secret = os.getenv('CLOUDINARY_API_SECRET')
    mongo_url = os.getenv('MONGODB_URI')

    worker_function(redis_host, redis_port, queue_name, cloud_name, api_key, api_secret, mongo_url)
    
    # num_workers = multiprocessing.cpu_count()
    # processes = []

    # for _ in range(num_workers):
    #     p = multiprocessing.Process(target=worker_function)
    #     processes.append(p)
    #     p.start()

    # for p in processes:
    #     p.join()