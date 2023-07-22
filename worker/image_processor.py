from PIL import Image
import io
from exceptions import ImageDownloadError, OpenAndConvertImageError, CompressImageError, \
    ProcessImageError, UnknownProcessImageError


class ImageProcessor:
    def __init__(self, config_obj, cloudinary_client):
        self.config = config_obj
        self.cloudinary_client = cloudinary_client

    def process_image(self, image_url):
        try:
            image_bytes = self.cloudinary_client.download_image(image_url)
            image = self.open_and_convert_image(image_bytes)
            compressed_image_bytes = self.perform_image_compression(image)
            compressed_image_url = self.upload_compressed_image(compressed_image_bytes)
            return compressed_image_url
        except (ImageDownloadError, OpenAndConvertImageError, CompressImageError) as e:
            raise ProcessImageError(e)
        except Exception as e:
            raise UnknownProcessImageError(e)

    @staticmethod
    def open_and_convert_image(image_bytes):
        try:
            image = Image.open(io.BytesIO(image_bytes))
            image = image.convert("RGB")
            return image
        except Exception as e:
            raise OpenAndConvertImageError(e)

    @staticmethod
    def perform_image_compression(image):
        try:
            compressed_image_bytes = io.BytesIO()
            image.save(compressed_image_bytes, format='JPEG', quality=70)
            compressed_image_bytes.seek(0)
            return compressed_image_bytes
        except Exception as e:
            raise CompressImageError(e)

    def upload_compressed_image(self, compressed_image_bytes):
        return self.cloudinary_client.upload_image(compressed_image_bytes)
