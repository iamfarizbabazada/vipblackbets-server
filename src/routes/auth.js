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

const successRedirect = '/api/auth/authenticated'
const failureRedirect = '/api/auth/unauthorized'

async function isEmailVerified (req, res, next) {
  const isVerified = await User.checkEmailVerified(req.body.email)

  if (IS_PRODUCTION && !isVerified) {
    throw createError(403, 'Please make sure you have verified your email.')
  }

  next()
}

async function isAccountDeleted (req, res, next) {
  const user = await User.findOne({email: req.body.email})
  if (!user || user.deleted) {
    throw createError(404)
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
    const user = await User.register(newUser, req.body.password)

    const { rawOtp, expiredAt } = await OtpToken.generate(user)  
    console.log(rawOtp)

    await sendOtp(user.email, rawOtp, expiredAt)
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


router.get('/authenticated', async (req, res) => {
  res.json(req.user)
})

router.get('/unauthorized', async (req, res) => {
  res.json(createError.Unauthorized())
})


router.post(
  '/otp/reset',
  ensureNoActiveSession,
  async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    
    if(user.emailVerified) return res.sendStatus(400)
    
    const oldToken = await OtpToken.findByUser(user)
    if(!oldToken.checkIsExpired()) return res.sendStatus(400)

    const { rawOtp, expiredAt } = await OtpToken.generate(user)  
    console.log(rawOtp)

    await sendOtp(user.email, rawOtp, expiredAt)
    res.json({ success: true })
})

router.post(
  '/otp/verify',
  ensureNoActiveSession,
  async (req, res) => {
    const { otp, email } = req.body
    const user = await User.findOne({email})

    const otpToken = await OtpToken.findByUser(user)

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

    await user.verify()
    ////////////////////////////

    res.sendStatus(200)
})

router.post(
  '/password/request',
  ensureNoActiveSession,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required()
    })
  }),
  async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json(createError.NotFound('User not found.'));
    }

    const oldToken = await OtpToken.findByUser(user)
    if(!oldToken.checkIsExpired()) return res.sendStatus(400)


    const resetToken = await OtpToken.generate(user);  
    console.log(resetToken.rawOtp);

    await sendOtp(user.email, resetToken.rawOtp, resetToken.expiredAt);
    res.sendStatus(200)
})


// Route to reset the password
router.post(
  '/password/reset',
  ensureNoActiveSession,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      otp: Joi.string().required(),
      email: Joi.string().email().required(),
      newPassword: Joi.string().min(8).required()
    })
  }),
  async (req, res) => {
    const { otp, email, newPassword } = req.body;

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json(createError.NotFound('User not found.'));
    }
    const otpToken = await OtpToken.findByUser(user)
    
    if(!otpToken) {
      return res.json(createError.NotFound())
    } 
    
    else if(!otpToken.verify(otp)) {
      return res.json(createError.BadRequest('Otp incorrect!'))
    }

    else if (otpToken.checkIsExpired()) {
      return res.json(createError.BadRequest('Otp expired!'))
    }


    await user.setPassword(newPassword)


    res.sendStatus(200)
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
