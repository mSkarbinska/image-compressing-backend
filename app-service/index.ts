import './src/utils/redisSetup'
import './src/utils/cloudinarySetup'
import './src/utils/mongoSetup'

import express from 'express'
import {config} from 'dotenv'

import {imageRouter} from './src/routes/imageRoutes'
import {taskRouter} from './src/routes/taskRoutes'
import {notificationRouter} from './src/routes/notificationRoutes'

config()

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())

app.use('/image', imageRouter)
app.use('/task', taskRouter)
app.use('/notification', notificationRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
