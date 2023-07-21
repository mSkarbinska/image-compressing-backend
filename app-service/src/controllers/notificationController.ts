import * as express from 'express'
import * as notificationService from '../services/notificationService'

export const createSubscription = async (req: express.Request, res: express.Response) => {
    const { subscription } = req.body

    try {
        const result = await notificationService.createSubscription(subscription)
        return res.status(200).send(result)
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ error: 'Failed to create subscription.' })
    }
}