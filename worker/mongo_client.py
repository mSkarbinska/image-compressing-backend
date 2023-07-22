from pymongo import MongoClient
from bson import ObjectId
import logging
from pymongo.errors import ConnectionFailure
from exceptions import MongoDbConnectionError, UpdateFieldError, UpdateMongoDbObjectFieldError
from helpers import is_valid_mongo_id


class MongoDbClient:
    def __init__(self, config_obj,  mongo_client=None):
        self.config = config_obj
        self.client = mongo_client if mongo_client else MongoClient(self.config.MONGODB_URI)
        self.imagesCollection = self.client.test.imagemetadatas
        self.tasksCollection = self.client.test.compressingtasks

    def setup_mongo_client(self):
        self.client = MongoClient(self.config.MONGODB_URI)
        try:
            self.client.admin.command('ping')
        except ConnectionFailure as e:
            raise MongoDbConnectionError(e)

    @staticmethod
    def update_field_by_id(collection, object_id, field_name, new_field_value):
        try:
            is_valid_mongo_id(object_id) and isinstance(field_name, str) and isinstance(new_field_value, str)

            objects_filter = {"_id": ObjectId(object_id)}
            update = {"$set": {field_name: new_field_value}}
            result = collection.update_one(objects_filter, update)

            if result.modified_count > 0:
                logging.info(f'Field {field_name} updated successfully.')
            else:
                raise UpdateFieldError(field_name)
        except Exception as e:
            raise UpdateMongoDbObjectFieldError(object_id, e)

    def update_task_status(self, task_id, status):
        self.update_field_by_id(self.tasksCollection, task_id, 'status', status)

    def update_image_compressed_url(self, image_id, compressed_url):
        self.update_field_by_id(self.imagesCollection, image_id, 'compressedUrl', compressed_url)
