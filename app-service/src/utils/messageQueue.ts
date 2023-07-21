import { redisQueueClient } from './redisSetup'
import {config} from 'dotenv'
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
          console.error('Error sending message to Redis queue:', err)
        } else {
          console.log('Message sent to Redis queue:', message)
        }
      })
}


