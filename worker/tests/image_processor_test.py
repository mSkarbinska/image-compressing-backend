import pytest
from unittest.mock import MagicMock
from PIL import Image
from exceptions import ProcessImageError
from image_processor import ImageProcessor, ImageDownloadError


cloudinary_client_mock = MagicMock()


class TestImageProcessor:
    def test_process_image_with_download_error(self):
        fake_image_url_error = "https://example.com/fake_image_error.jpg"

        cloudinary_client_mock.download_image.side_effect = ImageDownloadError("Error downloading image")

        image_processor = ImageProcessor(config_obj=None, cloudinary_client=cloudinary_client_mock)

        with pytest.raises(ProcessImageError):
            image_processor.process_image(image_url=fake_image_url_error)

    def test_open_and_convert_image_with_local_image(self):
        with open('image/corgi.jpg', 'rb') as f:
            image_bytes = f.read()

        image_processor = ImageProcessor(config_obj=None, cloudinary_client=cloudinary_client_mock)

        image = image_processor.open_and_convert_image(image_bytes)
        assert isinstance(image, Image.Image)

