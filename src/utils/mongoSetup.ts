const mongoose = require('mongoose');
import * as dotenv from 'dotenv'

dotenv.config()

mongoose.connect(
  process.env.MONGODB_URI,
  {
      useNewUrlParser: true,
      useUnifiedTopology: true
  }
);