const {
  IS_PRODUCTION,
  SESSION_SECRET,
  COOKIE_MAX_AGE
} = require('../configs/env')

const session = require('express-session')
const redisClient = require('../redis')
const RedisStore = require('connect-redis').default

const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: SESSION_SECRET,
  cookie: {
    maxAge: COOKIE_MAX_AGE,
    sameSite: IS_PRODUCTION && 'none',
    secure: IS_PRODUCTION
  },
  resave: false,
  saveUninitialized: false
})

module.exports = {
  sessionMiddleware
}