import multiprocessing
import redis
import json

def worker_function(redis_host, redis_port, queue_name):
    def deserialize_message(message):
        message = queue_item.decode('utf-8')
        message_object = json.loads(message)
        image_url = message_object['imageUrl']
        image_name = message_object['imageName']
        task_id = message_object['taskId']

        return image_url, image_name, task_id


    def compress_image(image_url, image_name, task_id):
        pass
    def message_done(task_id):
        pass
    def upload_image(image_url, image_name, task_id):
        pass
    def save_to_db(image_url, image_name, task_id):
        pass


    redis_client = redis.Redis(host=redis_host, port=redis_port)

    while True:
        queue_item = redis_client.blpop(queue_name)

        if queue_item is not None:
            image_url, image_name, task_id = deserialize_message(queue_item)

            print(f"Received message: {image_url} {image_name} {task_id}")
            
            # take photo from url
            # compress photo
            # upload photo to s3

            # save to db info that compressing is done and attach url to the image metadata object



if __name__ == '__main__':
    redis_host = 'localhost'
    redis_port = 6379
    redis_client = redis.Redis(host=redis_host, port=redis_port)
    queue_name = 'image-queue'

    worker_function(redis_host, redis_port, queue_name)
    
    # num_workers = multiprocessing.cpu_count()
    # processes = []

    # for _ in range(num_workers):
    #     p = multiprocessing.Process(target=worker_function)
    #     processes.append(p)
    #     p.start()

    # for p in processes:
    #     p.join()