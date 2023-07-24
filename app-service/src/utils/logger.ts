import { createLogger, format, transports } from 'winston'
import chalk from 'chalk'

const customPrintf = format.printf((info) => {
    const logLevel = info.level.toUpperCase()
    let logMessage = `[${info.timestamp}] ${info.message}`

    if (info.level === 'error') {
        logMessage = '❌  ' + chalk.red(logLevel) + `: ${logMessage}`
    } else if (info.level === 'warn') {
        logMessage = '⚠️ ' + chalk.yellow(logLevel) + `: ${logMessage}`
    } else {
        logMessage = '✅  ' + chalk.green(logLevel) + `: ${logMessage}`
    }
    return logMessage
})

export const logger = createLogger({
    format: format.combine(
        format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        format.align(),
        customPrintf,

    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: 'logs/errors.log',
            level: 'error'
        }),
        new transports.File({
            filename: 'logs/combined.log'
        })
    ],
})
