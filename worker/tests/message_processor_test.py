import pytest
import json
from message_processor import MessageProcessor
from exceptions import DeserializeMessageError, SerializeMessageError


class TestMessageProcessor:
    def test_deserialize_message(self):
        message = b'{"imageUrl": "http://example.com/image.jpg", "taskId": "60902d098f8c0a001cb74f88", "imageId": "60902d098f8c0a001cb74f08"}'
        image_url, task_id, image_id = MessageProcessor.deserialize_message(message)
        assert image_url == "http://example.com/image.jpg"
        assert task_id == "60902d098f8c0a001cb74f88"
        assert image_id == "60902d098f8c0a001cb74f08"

        invalid_message = b'{"imageUrl": "http://example.com/image.jpg"}'  # Missing 'taskId' and 'imageId'
        with pytest.raises(DeserializeMessageError):
            MessageProcessor.deserialize_message(invalid_message)

        invalid_json = b'{"imageUrl": "http://example.com/image.jpg", "taskId": "60102d098f8c0a001cb74f08",'  # Incomplete JSON
        with pytest.raises(DeserializeMessageError):
            MessageProcessor.deserialize_message(invalid_json)

    def test_serialize_message(self):
        # Test valid inputs
        compressed_url = "http://example.com/compressed.jpg"
        task_id = "60202d098f8c0a001cb74f08"
        image_id = "60502d098f8c0a001cb74f08"
        serialized_message = MessageProcessor.serialize_topic_message(compressed_url, task_id, image_id)

        message = serialized_message.encode('utf-8')
        message_object = json.loads(message)

        deserialized_compressed_url = message_object['compressedUrl']
        deserialized_task_id = message_object['taskId']
        deserialized_image_id = message_object['imageId']
        assert deserialized_compressed_url == compressed_url
        assert deserialized_task_id == task_id
        assert deserialized_image_id == image_id

        invalid_url = 123
        invalid_task_id = 1111
        invalid_image_id = None

        with pytest.raises(SerializeMessageError):
            MessageProcessor.serialize_topic_message(invalid_url, task_id, image_id)

        with pytest.raises(SerializeMessageError):
            MessageProcessor.serialize_topic_message(compressed_url, invalid_task_id, image_id)

        with pytest.raises(SerializeMessageError):
            MessageProcessor.serialize_topic_message(compressed_url, task_id, invalid_image_id)
