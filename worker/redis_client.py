import redis
import logging
from exceptions import RedisConnectionError


class RedisClient:
    def __init__(self, config_obj):
        self.config = config_obj
        self.client = redis.Redis(host=self.config.REDIS_HOST, port=self.config.REDIS_PORT)
        self.publisher = self.client.pubsub()
        self.tasks_queue_name = self.config.QUEUE_NAME
        self.results_topic_name = self.config.TOPIC_NAME

    def redis_client_setup(self):
        self.client = redis.Redis(host=self.config.REDIS_HOST, port=self.config.REDIS_PORT,
                                  single_connection_client=False,
                                  retry_on_error=True)
        try:
            print(self.client.ping())
        except Exception as e:
            raise RedisConnectionError(e)

    def take_task_from_queue(self):
        result = self.client.blpop(self.tasks_queue_name)
        logging.info(f"Task taken from {self.tasks_queue_name} queue.")
        return result[1]

    def publish_result(self, message):
        deliveries_count = self.client.publish(self.results_topic_name, message)
        logging.info(f"Message published to {self.results_topic_name} topic. {deliveries_count} consumers received the message.")