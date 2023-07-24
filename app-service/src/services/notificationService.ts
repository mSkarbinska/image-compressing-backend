import {config} from 'dotenv'
// @ts-ignore
import webpush, {PushSubscription} from 'web-push'
import {redisTopicClient} from '../utils/redisSetup'
import {PushNotificationMessage} from '../types/PushNotificationMessage'
import {isValidURL} from '../utils/helpers'
import {logger} from '../utils/logger'

config()

webpush.setVapidDetails('mailto:' + process.env?.WEBPUSH_MAIL,
    process.env?.PUBLIC_VAPID_KEY || '',
    process.env?.PRIVATE_VAPID_KEY || '')

const subscriptions: PushSubscription[] = []

export const createSubscription = async (subscription: PushSubscription) => {
    if(!subscriptions.includes(subscription) && subscription.endpoint !== undefined) {
        subscriptions.push(subscription)
        logger.info('Subscription created:', subscription)
    }
    return await webpush.sendNotification(subscription, JSON.stringify({
        title: 'Hello from server!',
        body: 'I am ready to compress your images.'}))
        .then(() => {
                logger.info(`Notification sent to ${subscription.endpoint}`)
            })
        .catch((err) => {
        logger.error(`Sending notification to ${subscription.endpoint} failed.`, err)
    })
}

export const sendNotification = async (message: PushNotificationMessage) => {
    for (const subscription of subscriptions) {
        webpush.sendNotification(subscription, JSON.stringify(message)).catch((err) => {
            logger.error(`Sending notification to ${subscription.endpoint} failed.`, err)
        })
    }
}

redisTopicClient.on('message', (channel: string, message: string) => {
    logger.info(`Received message from channel ${channel}: ${message}`)

    sendNotification(prepareMessage(message))
        .then(() => logger.info(`Notification sent to all subscribers.`))
        .catch((err) => logger.error(`Sending notification message [${message}] to all subscribers failed.`, err))
})


const prepareMessage = (message: string): PushNotificationMessage => {
    const messageObject = JSON.parse(message)
    const compressedUrl = messageObject.compressedUrl

    isValidURL(compressedUrl)

    const messageToSubscribers = {
        title: 'Image compressed!',
        body: 'Your image is ready. Click here to see it.',
        url: compressedUrl
    }

    logger.info(`Message prepared for subscribers: ${JSON.stringify(messageToSubscribers)}`)

    return messageToSubscribers
}