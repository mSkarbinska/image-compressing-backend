const redis = require('./redisSetup')

const queueName = 'image-queue';

const sendMessage =  (message: any) => {
    message = JSON.stringify(message);
    redis.lpush(queueName, message, (err: any) => {
        if (err) {
          console.error('Error sending message to Redis queue:', err);
        } else {
          console.log('Message sent to Redis queue:', message);
        }
      });
}


module.exports = {
    sendMessage
}

