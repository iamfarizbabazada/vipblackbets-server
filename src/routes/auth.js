const createError = require('http-errors')
const router = require('express-promise-router')()
const { celebrate, Joi, Segments } = require('celebrate')
const passport = require('passport')
const Otp = require('../utils/crypto').Otp
const User = require('../models/user')
const OtpToken = require('../models/otp.token')
const { sendOtp } = require('../utils/mailer')
const { IS_PRODUCTION } = require('../configs/env')
const { ensureAuth, ensureNoActiveSession } = require('../middlewares/auth')

const successRedirect = '/api/auth/otp'
const failureRedirect = '/api/auth/unauthorized'

async function isEmailVerified (req, res, next) {
  const isVerified = await User.checkEmailVerified(req.body.email)

  if (IS_PRODUCTION && !isVerified) {
    throw createError(403, 'Please make sure you have verified your email.')
  }

  next()
}

async function isAccountDeleted (req, res, next) {
  const isDeleted = await User.checkDeleted(req.body.email)

  if (isDeleted) {
    throw createError(401)
  }

  next()
}

const registerUserValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    user: Joi.object().keys({
      name: Joi.string().min(3).max(60).trim().required(),
      email: Joi.string().email().required(),
    }),
    password: Joi.string().min(8).required()
  })
})

router.post(
  '/register',
  ensureNoActiveSession,
  registerUserValidator,
  async (req, res) => {
    const newUser = new User(req.body.user)
    await User.register(newUser, req.body.password)

    res.sendStatus(200)
})

router.post(
  '/login',
  ensureNoActiveSession,
  isAccountDeleted,
  isEmailVerified,
  passport.authenticate('local', {
    successRedirect,
    failureRedirect
  }))

router.post(
  '/otp',
  async (req, res) => {
    const user = req.user
    const { rawOtp, expiredAt } = await OtpToken.generate({ user })  

    await sendOtp(user.email, rawOtp, expiredAt)
    res.json({ success: true })
})

router.post(
  '/otp/verify',
  async (req, res) => {
    const user = req.user
    const { otp } = req.body

    const otpToken = await Otp.findByUser(user)

    // Implement Promise /////////////////

    if(!otpToken) {
      return res.json(createError.NotFound())
    } 
    
    else if(!otpToken.verify(otp)) {
      return res.json(createError.BadRequest('Otp incorrect!'))
    }

    else if (otpToken.checkIsExpired()) {
      return res.json(createError.BadRequest('Otp expired!'))
    }

    ////////////////////////////

    res.json({ user: req.user })
})

router.get('/unauthorized', async (req, res) => {
  res.json(createError.Unauthorized())
})


router.post(
  '/logout',
  ensureAuth,
  (req, res, next) => {
    req.logout((err) => {
      if (err) { return next(err) }
      res.sendStatus(200)
    })
  })

module.exports = router
