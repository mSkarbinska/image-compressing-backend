import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose, {ConnectOptions} from 'mongoose'


export const connect = async () => {
    const mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    try {
        await mongoose.connect(uri, {
        } as ConnectOptions)
    }
    catch (error) {
        console.log(error)
    }
}
