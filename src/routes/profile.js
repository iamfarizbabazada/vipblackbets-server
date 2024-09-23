const router = require('express-promise-router')()
const rateLimit = require('express-rate-limit')
const { celebrate, Joi, Segments } = require('celebrate')
const User = require('../models/user')
const Order = require('../models/order')
const Notification = require('../models/notification')
const { ensureAuth } = require('../middlewares/auth')
const upload = require('../middlewares/upload')

router.get(
  '/',
  ensureAuth,
  async (req, res) => {
    res.json(req.user)
  })

const updateProfileValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    profile: Joi.object().keys({
      name: Joi.string().min(3).max(60).trim(),
      email: Joi.string().email()
    })
  })
})

router.get(
  '/orders',
  ensureAuth,
  async (req, res) => {
    const orders = await Order.find({user: req.user})
    res.json(orders)
})

router.put(
  '/',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  }),
  ensureAuth,
  updateProfileValidator,
  async (req, res) => {
    await User.updateOne({email: req.user.email}, req.body.profile)
    res.sendStatus(200)
})

const changePasswordValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required()
  })
})

router.patch(
  '/change-password',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    // limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  }),
  ensureAuth,
  changePasswordValidator,
  async (req, res) => {
    const user = req.user;
    try {
      await user.changePassword(req.body.oldPassword, req.body.newPassword);
      await user.save();
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.status(401).json({ error: 'Şifre değişikliği başarısız.' });
    }
  })

router.patch(
  '/upload/avatar/',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  }),
  ensureAuth,
  upload.single('avatar'),
  async (req, res) => {
    const user = await User.findById(req.user._id)
    await user.changeAvatar(req.file.filename)

    res.sendStatus(200)
  })

router.delete(
  '/',
  ensureAuth,
  async (req, res, next) => {
    await req.user.delete()

    req.logout((err) => {
      if (err) { return next(err) }
      res.sendStatus(200)
    })
    res.sendStatus(200)
  })


const notificationValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
      token: Joi.string().required()
    })
  })

router.get(
    '/notifications',
    ensureAuth,
    async (req, res) => {
      res.json(await Notification.find({ receiver: req.user }))
    })
  


router.post(
  '/notifications',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  }),
  ensureAuth,
  notificationValidation,
  async (req, res) => {
    const { token } = req.body

    try {
      await req.user.updateExpoToken(token)
      res.sendStatus(200)
    } catch(err) {
      res.sendStatus(400)
    }
  }
)

router.get(
  '/support',
  ensureAuth,
  async (req, res) => {
    const admins = await User.find({ role: 'ADMIN' })
    res.json(admins)
  })

module.exports = router
