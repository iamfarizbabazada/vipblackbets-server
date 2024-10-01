const createError = require('http-errors')
const router = require('express-promise-router')()
const rateLimit = require('express-rate-limit')
const { celebrate, Joi, Segments } = require('celebrate')
const passport = require('passport')
const Otp = require('../utils/crypto').Otp
const User = require('../models/user')
const OtpToken = require('../models/otp.token')
const mailer = require('../utils/mailer')
const { IS_PRODUCTION } = require('../configs/env')
const { ensureAuth, ensureNoActiveSession } = require('../middlewares/auth')

const successRedirect = '/api/auth/authenticated'
const failureRedirect = '/api/auth/unauthorized'

async function isEmailVerified (req, res, next) {
  const user = await User.checkEmailVerified(req.body.email)

  if (IS_PRODUCTION && !user?.emailVerified) {
    const err = createError(403, 'Hesabınızı təsdiqlədiyinizdən əmin olun.')
    err.action = 'VERIFICATION'
    throw err
  }

  next()
}

async function isAccountDeleted (req, res, next) {
  const user = await User.findOne({email: req.body.email})
  if (!user) {
    throw createError.NotFound("İstifadəçi tapılmadı")
  }

  next()
}

async function isAdminLogin (req, res, next) {
  const user = await User.findOne({email: req.body.email, role: 'ADMIN'})
  if (!user) {
    throw createError.NotFound("İstifadəçi tapılmadı")
  }

  next()
}

const registerUserValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    user: Joi.object().keys({
      name: Joi.string().min(3).max(60).trim().required(),
      email: Joi.string().email().lowercase().required(),
    }),
    password: Joi.string().min(8).required()
  })
})

router.post(
  '/register',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  }),
  ensureNoActiveSession,
  registerUserValidator,
  async (req, res) => {
    const newUser = new User(req.body.user)
    const user = await User.register(newUser, req.body.password)

    const { rawOtp, expiredAt } = await OtpToken.generate(user)  

    await mailer.sendOtp(user.email, rawOtp, expiredAt)
    res.sendStatus(200)
})



router.post(
  '/login',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  }),
  ensureNoActiveSession,
  isAccountDeleted,
  isEmailVerified,
  passport.authenticate('local', {
    successRedirect,
    failureRedirect,
}))

router.post(
  '/admin/login',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  }),
  ensureNoActiveSession,
  isAccountDeleted,
  isAdminLogin,
  passport.authenticate('local', {
    successRedirect,
    failureRedirect,
}))


router.get('/authenticated', async (req, res) => {
  console.log(req.user)
  res.json(req.user)
})

router.get('/unauthorized', async (req, res) => {
  throw createError.Unauthorized("Şifrə və ya E-poçt ünvanı yanlışdır!")
})


router.post(
  '/otp/reset',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  }),
  ensureNoActiveSession,
  async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email: email.toLowerCase() })
    
    if(user.emailVerified) throw createError(400)
    
    const oldToken = await OtpToken.findByUser(user)
    if(!oldToken.checkIsExpired()) throw createError(400)

    const { rawOtp, expiredAt } = await OtpToken.generate(user)  

    await mailer.sendOtp(user.email, rawOtp, expiredAt)
    res.json({ success: true, rawOtp })
})

router.post(
  '/otp/verify',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  }),
  ensureNoActiveSession,
  async (req, res) => {
    const { otp, email } = req.body
    const user = await User.findOne({email: email.toLowerCase()})

    const otpToken = await OtpToken.findByUser(user)

    // Implement Promise /////////////////

    if(!otpToken) {
      throw createError.NotFound()
    } 
    
    else if(!otpToken.verify(otp)) {
      throw createError.BadRequest('Otp yanlışdır!')
    }

    else if (otpToken.checkIsExpired()) {
      throw createError.BadRequest('Otp müddəti bitib!')
    }

    await user.verify()
    ////////////////////////////

    res.sendStatus(200)
})

router.post(
  '/password/request',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  }),
  ensureNoActiveSession,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required()
    })
  }),
  async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      throw createError.NotFound('İstifadəçi tapılmadı')
    }

    const oldToken = await OtpToken.findByUser(user)
    if(oldToken && !oldToken.checkIsExpired()) throw createError.BadRequest('Yeni təsdiqləmə mesajini almaq üçün gözləməlisiniz')


    const resetToken = await OtpToken.generate(user);  

    await mailer.sendOtp(user.email, resetToken.rawOtp, resetToken.expiredAt);
    res.sendStatus(200)
})


// Route to reset the password
router.post(
  '/password/reset',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  }),
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

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      throw createError.NotFound('İstifadəçi tapılmadı.')
    }
    const otpToken = await OtpToken.findByUser(user)
    
    if(!otpToken) {
      throw createError.NotFound()
    } 
    
    else if(!otpToken.verify(otp)) {
      throw createError.BadRequest('Otp yanlışdır!')
    }

    else if (otpToken.checkIsExpired()) {
      throw createError.BadRequest('Otp müddəti bitib!')
    }

    await user.setPassword(newPassword)
    await user.save()
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
