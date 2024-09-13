const createError = require('http-errors')
const { v4 } = require('uuid')
const router = require('express-promise-router')()
const { celebrate, Joi, Segments } = require('celebrate')
const { NEWSLETTER_MAIL } = require('../configs/event-names')
const User = require('../models/user')
const Order = require('../models/order')
const { ensureRole } = require('../middlewares/auth')
const upload = require('../middlewares/upload')
const { validateObjectId, bulkValidateObjectId } = require('../utils/validate-objectid')

const paginationValidator = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().positive().integer().default(1),
    limit: Joi.number().positive().integer().default(20),
  })
})

router.get(
  '/',
  ensureRole(['ADMIN']),
  paginationValidator,
  async (req, res) => {
    const { page = 1, limit = 20 } = req.query
    const skip = (page - 1) * limit

    const total = await Order.countDocuments()
  
    const orders = await Order.find()
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: 'desc' })

    res.json({ orders, total })
})

router.get(
  '/:id',
  ensureRole(['ADMIN']),
  async (req, res) => {
    validateObjectId(req.params.id)

    const order = await Order.findById(req.params.id)
    if (!order) throw createError(404)

    res.json(order)
  })

const createOrderValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    status: Joi.string().valid('PENDING').default('PENDING').forbidden(),
    amount: Joi.number().min(0),
    paymentType: Joi.string(),
    provider: Joi.string()
  })
})

router.post(
  '/',
  ensureRole(['USER']),
  createOrderValidator,
  upload.single('file'),
  async (req, res) => {
    const newOrder = new Order(req.body)
    newOrder.file = req.file.filename
    newOrder.user = req.user
    await newOrder.save()

    res.sendStatus(200)
  })

const updateOrderValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    order: Joi.object().keys({
      amount: Joi.number().min(0),
      paymentType: Joi.string(),
      provider: Joi.string()
    })
  })
})

router.put(
  '/:id',
  ensureRole(['ADMIN']),
  updateOrderValidator,
  async (req, res) => {
    validateObjectId(req.params.id)

    await Order.findByIdAndUpdate(req.params.id, req.body.order)

    res.sendStatus(200)
  })

router.patch(
  '/:id/complete',
  ensureRole(['ADMIN']),
  async (req, res) => {
    validateObjectId(req.params.id)

    const order = await Order.findById(req.params.id)
    if (!order) throw createError(404)
    if (order.status === 'COMPLETED') throw createError(400)

    await order.complete()
    res.sendStatus(200)
})

router.patch(
  '/:id/reject',
  ensureRole(['ADMIN']),
  async (req, res) => {
    validateObjectId(req.params.id)

    const order = await Order.findById(req.params.id)
    if (!order) throw createError(404)
    if (order.status === 'REJECTED') throw createError(400)

    await order.reject()
    res.sendStatus(200)
})

router.delete(
  '/:id',
  ensureRole(['ADMIN']),
  async (req, res) => {
    validateObjectId(req.params.id)

    const order = await Order.findById(req.params.id)
    if (!order) throw createError(404)

    await order.delete()

    res.sendStatus(200)
  })

module.exports = router
