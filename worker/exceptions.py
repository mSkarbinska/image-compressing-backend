class ImageDownloadError(Exception):
    def __init__(self, error):
        super().__init__(f"Error occurred while downloading the image: {error}")


class OpenAndConvertImageError(Exception):
    def __init__(self, error):
        super().__init__(f"Error occurred while opening and converting the image: {error}")


class CompressImageError(Exception):
    def __init__(self, error):
        super().__init__(f"Error occurred while compressing the image: {error}")


class UploadImageError(Exception):
    def __init__(self, error):
        super().__init__(f"Error occurred while uploading the image: {error}")


class ProcessImageError(Exception):
    def __init__(self, error):
        super().__init__(f"Error occurred while processing the image: {error}")


class SerializeMessageError(Exception):
    def __init__(self, error):
        super().__init__(f"Error occurred while serializing the message: {error}")


class DeserializeMessageError(Exception):
    def __init__(self, error):
        super().__init__(f"Error occurred while deserializing the message: {error}")


class MongoDbConnectionError(Exception):
    def __init__(self, error):
        super().__init__(f"Error occurred while connecting to MongoDB: {error}")


class RedisConnectionError(Exception):
    def __init__(self, error):
        super().__init__(f"Error occurred while connecting to Redis: {error}")


class CloudinaryConnectionError(Exception):
    def __init__(self, error):
        super().__init__(f"Error occurred while connecting to Cloudinary: {error}")


class UpdateFieldError(Exception):
    def __init__(self, field):
        super().__init__(f"Error occurred while updating the field: {field}")


class UnknownProcessImageError(Exception):
    def __init__(self, error):
        super().__init__(f"Unknown error occurred while processing the image: {error}")


class InvalidUrlError(Exception):
    def __init__(self, url):
        super().__init__(f"Invalid URL: {url}")


class InvalidMongoObjectIdError(Exception):
    def __init__(self, object_id):
        super().__init__(f"Invalid MongoDB ObjectId: {object_id}")


class InvalidTypeError(Exception):
    def __init__(self, value, expected_type):
        super().__init__(f"Invalid type: {type(value)}, expected type: {expected_type}")


class UpdateMongoDbObjectFieldError(Exception):
    def __init__(self, object_id, error):
        super().__init__(f"Error occurred while updating object with id:<{object_id}>. {error}")