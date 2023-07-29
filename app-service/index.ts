import './src/utils/redisSetup'
import './src/utils/cloudinarySetup'
import './src/utils/mongoSetup'

import express from 'express'
import {config} from 'dotenv'

import {imageRouter} from './src/routes/imageRoutes'
import {taskRouter} from './src/routes/taskRoutes'
import {notificationRouter} from './src/routes/notificationRoutes'
import {logger} from './src/utils/logger'
import cors from 'cors'

config()

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(cors())

app.use('/images', imageRouter)
app.use('/tasks', taskRouter)
app.use('/notification', notificationRouter)


app.use((err: Error, req: express.Request, res: express.Response) => {
  logger.error('Unknown error: ' + err)

  const errorMessage = 'Something went wrong. Please try again later.'
  res.status(500).json({ error: errorMessage })
})

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`)
})

