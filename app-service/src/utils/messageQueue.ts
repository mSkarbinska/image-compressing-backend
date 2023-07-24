import { redisQueueClient } from './redisSetup'
import {config} from 'dotenv'
import {logger} from './logger'
config()

const queueName = process.env.REDIS_QUEUE_NAME || 'queue'

export interface QueueMessage {
    imageId: string,
    taskId: string
    imageUrl: string
}

export const sendMessageToQueue =  (message: QueueMessage) => {
    const messageString = JSON.stringify(message)
    redisQueueClient.lpush(queueName, messageString, (err: any) => {
        if (err) {
          logger.error('Error sending message to Redis queue:', err)
        } else {
            logger.info('Message sent to Redis queue:', message)
        }
      })
}


