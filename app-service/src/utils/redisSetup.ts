import { config } from 'dotenv'
import { logger } from './logger'

config()

const Redis = require('ioredis')

const retryStrategy = (times: number) => {
    if (times > 4) {
        logger.error('Too many retries on REDIS. Connection Terminated')
        return new Error('Too many retries on REDIS. Connection Terminated')
    } else {
        return times
    }
}

const createRedisClient = (channel: string) => {
    const redisClient = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        retryStrategy,
    })
        .on('connect', () => {
            logger.info('Connected to Redis')
            if (channel === 'tasks-results') {
                redisClient.subscribe(channel)
                logger.info(`Subscribed to Redis channel: ${channel}`)
            }
        })
        .on('error', (err: any) => logger.error('Failed to connect to Redis', err.error))
        .on('close', () => logger.warn('Redis connection closed'))
        .on('reconnecting', () => logger.info('Redis reconnecting...'))
        .on('end', () => {
            logger.info('Redis connection ended')
            process.exit(1)
        })

    return redisClient
}

export const redisQueueClient = createRedisClient('tasks-queue')
export const redisTopicClient = createRedisClient('tasks-results')
