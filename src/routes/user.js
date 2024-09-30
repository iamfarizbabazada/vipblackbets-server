const createError = require('http-errors')
const router = require('express-promise-router')()
const { celebrate, Joi, Segments } = require('celebrate')
const User = require('../models/user')
const { validateObjectId } = require('../utils/validate-objectid')
const { ensureRole } = require('../middlewares/auth')
const upload = require('../middlewares/upload')

const paginationValidator = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().positive().integer().default(1),
    limit: Joi.number().positive().integer().default(20),
    name: Joi.string().optional()
  })
})


router.get(
  '/',
  ensureRole('ADMIN'),
  paginationValidator,
  async (req, res) => {
    const { page = 1, limit = 20, name } = req.query
    const skip = (page - 1) * limit
    const filter = {}

    if (name) {
      filter.name = new RegExp(name, 'i')
    }

    filter.role = 'ADMIN'


    const total = await User.countDocuments(filter)
    const users = await User.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: 'desc' })

    res.json({ users, total })
})

router.get(
  '/:id',
  ensureRole('ADMIN'),
  async (req, res) => {
    validateObjectId(req.params.id)

    const user = await User.findById(req.params.id)
    if (!user || user.role == 'ADMIN') throw createError(404)

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
  ensureRole('ADMIN'),
  updateUserValidator,
  async (req, res) => {
    validateObjectId(req.params.id)
    const user = await User.findByIdAndUpdate(req.params.id, req.body.user)
    let status = 200

    if (req.body.password) {
      user.setPassword(req.body.password, (err) => {
        if(err) {
          console.log(err)
          status = 400
        } else {
          user.save()
        }
      })
    }

    res.sendStatus(status)
  })

router.patch(
  '/upload/avatar/:id',
  ensureRole('ADMIN'),
  upload.single('avatar'), async (req, res) => {
    validateObjectId(req.params.id)

    const user = await User.findById(req.params.id)
    if (!user) throw createError(404)

    await user.changeAvatar(req.file.filename)

    res.sendStatus(200)
  })

router.delete(
  '/:id',
  ensureRole('ADMIN'),
  async (req, res) => {
    validateObjectId(req.params.id)

    const user = await User.findById(req.params.id)
    if (!user) throw createError(404)

    await user.delete()

    res.sendStatus(200)
  })

module.exports = router
