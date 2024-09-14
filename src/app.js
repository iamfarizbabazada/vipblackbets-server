const {
  IS_PRODUCTION,
} = require('./configs/env')
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./configs/swagger');
const createError = require('http-errors')
const path = require('path')
const express = require('express')
const morgan = require('morgan')
const logger = require('./utils/logger')
const cors = require('cors')
const helmet = require('helmet')
const sanitize = require('express-mongo-sanitize').sanitize
const compression = require('compression')
const { errors } = require('celebrate')
const { sessionMiddleware } = require('./middlewares/session');
const cookieParser = require('cookie-parser')

const passport = require('passport')
const User = require('./models/user')
require('./db')

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const userRouter = require('./routes/user')
const orderRouter = require('./routes/order');

const app = express()

app.use(helmet())
app.use(compression())
app.use(cors())

app.set('trust proxy', 1)



app.use(sessionMiddleware)

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(morgan('dev', {
  stream: {
    write: (msg) => logger.info(msg.trim())
  }
}))


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.all('*', (req, res, next) => {
  req.body = sanitize(req.body)
  req.headers = sanitize(req.headers)
  req.params = sanitize(req.params)

  next()
})

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.redirect('/health')
})

app.get('/health', (req, res) => {
  res.sendStatus(200)
})

if(!IS_PRODUCTION) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
}

app.use('/api/auth', authRouter)
app.use('/api/profile', profileRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)

app.use(function (req, res, next) {
  next(createError(404))
})

app.use(errors())

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  logger.error(err)

  res.status(err.status || 500)
  res.send(
    req.app.get('env') === 'development'
      ? { stack: err.stack, message: err.message }
      : { message: err.message }
  )
})


async function seed() {
  if(await User.countDocuments({role: 'ADMIN'}) > 1) return

  const newUser = new User({
    name: "admin",
    email: "admin@admin.com",
    role: "ADMIN"
  })

  await User.register(newUser, "password123")
}

seed()

module.exports = app
