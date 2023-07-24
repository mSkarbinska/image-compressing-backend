import * as express from 'express'
import * as notificationService from '../services/notificationService'
import {logger} from '../utils/logger'

export const createSubscription = async (req: express.Request, res: express.Response) => {
    const { subscription } = req.body
    logger.info('Subscription received:', subscription)
    try {
        const result = await notificationService.createSubscription(subscription)
        logger.info('Subscription created successfully', result)
        return res.status(200).send(result)
    }
    catch (error) {
        logger.error('Subscription creation failed', error)
        return res.status(500).send({ error: 'Failed to create subscription.' })
    }
}