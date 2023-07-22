from cloudinary import uploader, config, api
import requests
from exceptions import ImageDownloadError, UploadImageError, CloudinaryConnectionError


class CloudinaryClient:
    def __init__(self, config_obj):
        self.config = config_obj
        self.setup_cloudinary()

    def setup_cloudinary(self):
        config(
            cloud_name=self.config.CLOUD_NAME,
            api_key=self.config.API_KEY,
            api_secret=self.config.API_SECRET
        )

        try:
            api.ping()
        except Exception as e:
            raise CloudinaryConnectionError(e)

    @staticmethod
    def download_image(image_url):
        try:
            response = requests.get(image_url)
            return response.content
        except Exception as e:
            raise ImageDownloadError(e)

    @staticmethod
    def upload_image(image_data):
        try:
            result = uploader.upload(image_data, folder='compressed_images')
            return result['secure_url']
        except Exception as e:
            raise UploadImageError(e)