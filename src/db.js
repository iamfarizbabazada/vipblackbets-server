const mongoose = require('mongoose')
const {
  IS_PRODUCTION,
  MONGODB_CONNECTION_STRING,
  DB_NAME
} = require('./configs/env')

if (!IS_PRODUCTION) {
  mongoose.set('debug', true)
}

mongoose.Promise = global.Promise

mongoose.set('strictQuery', false)

mongoose.connect(MONGODB_CONNECTION_STRING, {
  dbName: DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

module.exports = db
