const redis = require('redis')
const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USERNAME,
  REDIS_PASSWORD,
} = require('./configs/env')

const client = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  // username: REDIS_USERNAME,
  // password: REDIS_PASSWORD,
})

client.connect().catch(console.error)

module.exports = client
