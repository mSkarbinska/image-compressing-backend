import * as express from 'express'
import * as notificationController from '../controllers/notificationController'
export const notificationRouter = express.Router()

notificationRouter.post('/subscription', notificationController.createSubscription)

