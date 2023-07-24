import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose, {ConnectOptions} from 'mongoose'
import chalk from 'chalk'


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

jest.mock('winston', () => ({
    createLogger: jest.fn(() => ({
        log: jest.fn(),
        info: jest.fn().mockImplementation((message: string) => console.log(message)),
        error: jest.fn().mockImplementation((message: string) => console.log(chalk.red(message))),
        warn: jest.fn().mockImplementation((message: string) => console.log(chalk.yellow(message))),
    })),
    transports: {
        Console: jest.fn(),
        File: jest.fn(),
    },
    format: {
        json: jest.fn(),
        timestamp: jest.fn(),
        printf: jest.fn(),
        align: jest.fn(),
        combine: jest.fn(),
    },
}))
