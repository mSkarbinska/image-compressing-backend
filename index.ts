import express from 'express'
import dotenv from 'dotenv'
dotenv.config()


require('./src/utils/redisSetup')
require('./src/utils/cloudinarySetup')
require('./src/utils/mongoSetup')


const PORT = process.env.PORT || 3000
const app = express()


app.use(express.json())


const imageRoutes = require('./src/routes/imageRoutes')
app.use('/', imageRoutes)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
