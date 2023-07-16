import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 3000
const app = express()

const redis = require('./src/utils/redisSetup')
const mongoose = require("mongoose");
const imageRoutes = require('./src/routes/imageRoutes')

mongoose.connect(
  process.env.MONGODB_URI, 
  {
      useNewUrlParser: true,
      useUnifiedTopology: true
  }
);

app.use(express.json())
app.use('/', imageRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
