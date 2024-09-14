const router = require('express-promise-router')()
const { celebrate, Joi, Segments } = require('celebrate')
const User = require('../models/user')
const Order = require('../models/order')
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
  ensureAuth,
  changePasswordValidator,
  async (req, res) => {
    const user = req.user
    user.changePassword(req.body.oldPassword, req.body.newPassword, async (err) => {
      console.log(err)
      if(!err) {
        await user.save()
        res.sendStatus(200)
      } else {
        res.sendStatus(401)
      }
    })
  })

router.patch(
  '/upload/avatar/',
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

router.get(
  '/support',
  ensureAuth,
  async (req, res) => {
    const admins = await User.find({ role: 'ADMIN' })
    res.json(admins)
  })

module.exports = router
