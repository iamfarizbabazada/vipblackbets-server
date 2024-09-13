const createError = require('http-errors')
const router = require('express-promise-router')()
const { celebrate, Joi, Segments } = require('celebrate')
const User = require('../models/user')
const { validateObjectId } = require('../utils/validate-objectid')
const { ensureRole } = require('../middlewares/auth')
const upload = require('../middlewares/upload')

router.get(
  '/',
  ensureRole('ADMIN'),
  async (req, res) => {
    const users = await User.find({ isDeleted: false })
    res.json(users)
  })

router.get(
  '/:id',
  ensureRole('ADMIN'),
  async (req, res) => {
    validateObjectId(req.params.id)

    const user = await User.findById(req.params.id)
    if (!user || user.isDeleted) throw createError(404)

    res.json(user)
  })

const createUserValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    user: Joi.object().keys({
      name: Joi.string().min(3).max(60).trim().required(),
      email: Joi.string().email().required(),
      role: Joi.string().valid('ADMIN', 'USER').default('USER')
    }),
    password: Joi.string().min(8).required()
  })
})

router.post(
  '/',
  ensureRole('ADMIN'),
  createUserValidator,
  async (req, res) => {
    const newUser = new User(req.body.user)
    await User.register(newUser, req.body.password)

    res.sendStatus(200)
  })

const updateUserValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    user: Joi.object().keys({
      name: Joi.string().min(3).max(60).trim(),
      email: Joi.string().email()
    }),
    password: Joi.string().min(8)
  }),
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required()
  })
})

router.put(
  '/:id',
  ensureRole('EDITOR'),
  updateUserValidator,
  async (req, res) => {
    validateObjectId(req.params.id)
    const user = await User.findByIdAndUpdate(req.params.id, req.body.user)

    if (req.body.password) {
      user.setPassword(req.body.password, () => {
        user.save()
      })
    }

    res.sendStatus(200)
  })

router.patch(
  '/upload/avatar/:id',
  ensureRole('EDITOR'),
  upload.single('avatar'), async (req, res) => {
    validateObjectId(req.params.id)

    const user = await User.findById(req.params.id)
    if (!user || user.isDeleted) throw createError(404)

    await user.changeAvatar(req.file.filename)

    res.sendStatus(200)
  })

router.delete(
  '/:id',
  ensureRole('ADMIN'),
  async (req, res) => {
    validateObjectId(req.params.id)

    const user = await User.findById(req.params.id)
    if (!user || user.isDeleted) throw createError(404)

    await user.delete()

    res.sendStatus(200)
  })

module.exports = router
