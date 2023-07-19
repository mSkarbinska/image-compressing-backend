import {mongoose} from '@typegoose/typegoose'
import {config} from 'dotenv'
config()

mongoose.connect(
    process.env.MONGODB_URI as string,
).then(() =>
    console.log('Connected to MongoDB')
).catch(e => {
    console.log(e)
    console.log('Failed to connect to MongoDB')
})