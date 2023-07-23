import {config} from 'dotenv'
import webpush, {PushSubscription} from 'web-push'
import {redisTopicClient} from '../utils/redisSetup'
import {PushNotificationMessage} from '../types/PushNotificationMessage'
import {isValidURL} from '../utils/helpers'

config()

webpush.setVapidDetails('mailto:' + process.env?.WEBPUSH_MAIL,
    process.env?.PUBLIC_VAPID_KEY || '',
    process.env?.PRIVATE_VAPID_KEY || '')

const subscriptions: PushSubscription[] = []

console.log(subscriptions)
export const createSubscription = async (subscription: PushSubscription) => {
    if(!subscriptions.includes(subscription) && subscription.endpoint !== undefined) {
        subscriptions.push(subscription)
        console.log('Subscription created:', subscription)
    }
    return await webpush.sendNotification(subscription, JSON.stringify({
        title: 'Hello from server!',
        body: 'I am ready to compress your images.'
    }))
        .then(
            () => {
                console.log('Notification sent.')
            }
        ).catch((err) => {
        console.log('Sending notification via web-push failed.', err)
    })
}

export const sendNotification = async (message: PushNotificationMessage) => {
    for (const subscription of subscriptions) {
        webpush.sendNotification(subscription, JSON.stringify(message)).catch((err) => {
            console.log('Sending notification via web-push failed.', err)
        })
    }
}

redisTopicClient.on('message', (channel: string, message: string) => {
    console.log('Message received:', message)
    sendNotification(prepareMessage(message))
        .then(() => console.log('Notification sent.'))
        .catch((err) => console.log('Sending notification failed.',err))
})


const prepareMessage = (message: string): PushNotificationMessage => {
    const messageObject = JSON.parse(message)
    const compressedUrl = messageObject.compressedUrl

    isValidURL(compressedUrl)

    return {
        title: 'Image compressed!',
        body: 'Your image is ready. Click here to see it.',
        url: compressedUrl
    }
}