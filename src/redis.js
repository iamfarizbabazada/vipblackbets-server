const redis = require('redis')
const {
  REDIS_HOST,
  REDIS_PORT
} = require('./configs/env')

const client = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT
})

client.connect().catch(console.error)

module.exports = client
