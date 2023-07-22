import json
from exceptions import SerializeMessageError, DeserializeMessageError
from helpers import is_valid_url, is_valid_mongo_id


class MessageProcessor:
    @staticmethod
    def deserialize_message(message):
        try:
            message = message.decode('utf-8')
            message_object = json.loads(message)

            image_url = message_object['imageUrl']
            task_id = message_object['taskId']
            image_id = message_object['imageId']

            is_valid_url(image_url) and is_valid_mongo_id(task_id) and is_valid_mongo_id(image_id)

            return image_url, task_id, image_id
        except Exception as e:
            raise DeserializeMessageError(e)

    @staticmethod
    def serialize_topic_message(compressed_url, task_id, image_id):
        try:
            is_valid_url(compressed_url) and is_valid_mongo_id(task_id) and is_valid_mongo_id(image_id)

            message_object = {
                'compressedUrl': compressed_url,
                'imageId': image_id,
                'taskId': task_id
            }
            return json.dumps(message_object)
        except Exception as e:
            raise SerializeMessageError(e)
