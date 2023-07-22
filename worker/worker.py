import sys
from dotenv import load_dotenv
from config import Config
from redis_client import RedisClient
from mongo_client import MongoDbClient
from message_processor import MessageProcessor
from image_processor import ImageProcessor
from cloudinary_client import CloudinaryClient
from exceptions import *

load_dotenv()


def worker_function():
    try:
        redis_client = RedisClient(Config)
        mongo_client = MongoDbClient(Config)
        cloudinary_client = CloudinaryClient(Config)
        image_processor = ImageProcessor(Config, cloudinary_client)
    except (RedisConnectionError, MongoDbConnectionError, CloudinaryConnectionError) as e:
        print(f"Error occurred while connecting to external services: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error occurred while initializing the worker: {e}")
        sys.exit(1)

    print("Worker started.")

    while True:
        image_url, task_id, image_id = None, None, None
        compression_failed = False

        try:
            queue_message = redis_client.take_task_from_queue()

            image_url, task_id, image_id = MessageProcessor.deserialize_message(queue_message)

            print(f"Received message: {image_url} {task_id} {image_id}")

            compressed_image_url = image_processor.process_image(image_url)

            mongo_client.update_image_compressed_url(image_id, compressed_image_url)
            mongo_client.update_task_status(task_id, 'completed')

            message = MessageProcessor.serialize_topic_message(compressed_image_url, task_id, image_id)
            redis_client.publish_result(message)
        except DeserializeMessageError as e:
            print(f"Error occurred while deserializing the message from queue: {e}")
            compression_failed = True
            pass
        except (ProcessImageError, UnknownProcessImageError) as e:
            print(f"Error occurred while processing the image: {e}")
            compression_failed = True
            pass
        except UpdateFieldError as e:
            print(f"Compression of image {image_id} was successful, but failed to update the database: {e}")
            pass
        except SerializeMessageError as e:
            print(f"Compression of image {image_id} and db update was successful, but failed to serialize the message: {e}")
            pass

        if compression_failed:
            mongo_client.update_task_status(task_id, 'failed')


if __name__ == '__main__':
    try:
        worker_function()
    except KeyboardInterrupt:
        print("Worker stopped.")
        sys.exit(1)

    # num_workers = multiprocessing.cpu_count()
    # processes = []
    #
    # for _ in range(num_workers):
    #     p = multiprocessing.Process(target=worker_function)
    #     processes.append(p)
    #     p.start()
    #
    # for p in processes:
    #     p.join()
