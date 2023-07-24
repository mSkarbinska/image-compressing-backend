import {mongoose} from '@typegoose/typegoose'
import {config} from 'dotenv'
import {logger} from './logger'
config()

mongoose.connect(
    process.env.MONGODB_URI as string,
).then(() =>
    logger.info('Connected to MongoDbClient.')
).catch(e => {
    logger.error('Failed to connect to MongoDbClient.', e)
})