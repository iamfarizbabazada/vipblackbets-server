const {
  IS_PRODUCTION,
  SESSION_SECRET,
  COOKIE_MAX_AGE,
  MONGODB_CONNECTION_STRING,
  DB_NAME
} = require('../configs/env')

const session = require('express-session')
const redisClient = require('../redis')
const RedisStore = require('connect-redis').default
const MongoStore = require('connect-mongo')
const connection = require('../db')

// const sessionMiddleware = session({
//   store: new RedisStore({ client: redisClient }),
//   secret: SESSION_SECRET,
//   cookie: {
//     maxAge: COOKIE_MAX_AGE,
//     sameSite: IS_PRODUCTION && 'none',
//     secure: IS_PRODUCTION
//   },
//   resave: false,
//   saveUninitialized: false
// })


const sessionMiddleware = session({
  store: MongoStore.create({
    // mongooseConnection: connection,
    // stringify: false
    mongoUrl: MONGODB_CONNECTION_STRING,
    dbName: DB_NAME,
    stringify: false
  }),
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