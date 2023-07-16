import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const redis = require('./src/utils/redisSetup')

app.use(express.json())
app.get('/', (req: express.Request, res: express.Response) =>
  res.send('Hello World!')
)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
