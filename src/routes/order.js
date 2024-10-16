const createError = require('http-errors')
const { v4 } = require('uuid')
const router = require('express-promise-router')()
const { celebrate, Joi, Segments } = require('celebrate')
const { NEWSLETTER_MAIL } = require('../configs/event-names')
const User = require('../models/user')
const Order = require('../models/order')
const Balance = require('../models/balance')
const Deposit = require('../models/deposit')
const Withdraw = require('../models/withdraw')
const Notification = require('../models/notification')
const { ensureRole } = require('../middlewares/auth')
const upload = require('../middlewares/upload')
const { validateObjectId, bulkValidateObjectId } = require('../utils/validate-objectid')
const { sendPushNotification } = require('../utils/expo')

const paginationValidator = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().positive().integer().default(1),
    limit: Joi.number().positive().integer().default(20),
    status: Joi.string().optional(),
  })
})

router.get(
  '/',
  ensureRole(['ADMIN']),
  paginationValidator,
  async (req, res) => {
    const { page = 1, limit = 20, status } = req.query
    const skip = (page - 1) * limit

    const filter = {}

    if(status) {
      filter.status = status
    }

    const total = await Order.countDocuments(filter)
  
    const orders = await Order.find(filter)
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

  router.get(
    '/deposits',
    ensureRole(['ADMIN']),
    paginationValidator,
    async (req, res) => {
      const { page = 1, limit = 20, status } = req.query
      const skip = (page - 1) * limit
  
      const filter = {}
  
      if(status) {
        filter.status = status
      }
  
      const total = await Deposit.countDocuments(filter)
    
      const orders = await Deposit.find(filter)
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: 'desc' })
  
      res.json({ deposits: orders, total })
  })
  
  router.get(
    '/deposits/:id',
    ensureRole(['ADMIN']),
    async (req, res) => {
      validateObjectId(req.params.id)
  
      const order = await Deposit.findById(req.params.id)
      if (!order) throw createError(404)
  
      res.json(order)
    })

    
  router.get(
    '/balances',
    ensureRole(['ADMIN']),
    paginationValidator,
    async (req, res) => {
      const { page = 1, limit = 20, status } = req.query
      const skip = (page - 1) * limit
  
      const filter = {}
  
      if(status) {
        filter.status = status
      }
  
      const total = await Balance.countDocuments(filter)
    
      const orders = await Balance.find(filter)
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: 'desc' })
  
      res.json({ deposits: orders, total })
  })
  
  router.get(
    '/balances/:id',
    ensureRole(['ADMIN']),
    async (req, res) => {
      validateObjectId(req.params.id)
  
      const order = await Balance.findById(req.params.id)
      if (!order) throw createError(404)
  
      res.json(order)
    })



    router.get(
      '/withdraws',
      ensureRole(['ADMIN']),
      paginationValidator,
      async (req, res) => {
        const { page = 1, limit = 20, status } = req.query
        const skip = (page - 1) * limit
    
        const filter = {}
    
        if(status) {
          filter.status = status
        }
    
        const total = await Withdraw.countDocuments(filter)
      
        const orders = await Withdraw.find(filter)
          .limit(limit)
          .skip(skip)
          .sort({ createdAt: 'desc' })
    
        res.json({ withdraws: orders, total })
    })
    
    router.get(
      '/withdraws/:id',
      ensureRole(['ADMIN']),
      async (req, res) => {
        validateObjectId(req.params.id)
    
        const order = await Withdraw.findById(req.params.id)
        if (!order) throw createError(404)
    
        res.json(order)
      })


const createOrderValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
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
    console.log(req.body, req.file)
    const newOrder = new Order(req.body)
    if(req.file) {
      newOrder.file = req.file.filename
    }
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
    sendPushNotification({title: 'Qəbul olundu!', body: 'Sifariş qəbul olundu!', pushToken: order.user.expoPushToken, data: {orderId: order._id, receiver: order.user}})

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
    sendPushNotification({title: 'Qəbul olunmadı!', body: 'Sifariş qəbul olunmadı!', pushToken: order.user.expoPushToken, data: {orderId: order._id, receiver: order.user}})

    res.sendStatus(200)
})


router.patch(
  '/balances/:id/complete',
  ensureRole(['ADMIN']),
  async (req, res) => {
    validateObjectId(req.params.id)

    const order = await Balance.findById(req.params.id)
    if (!order) throw createError(404)
    if (order.status === 'COMPLETED') throw createError(400)

    await order.complete()
    sendPushNotification({title: 'Qəbul olundu!', body: 'Balans qəbul olundu!', pushToken: order.user.expoPushToken, data: {orderId: order._id, receiver: order.user}})

    res.sendStatus(200)
})

router.patch(
  '/balances/:id/reject',
  ensureRole(['ADMIN']),
  async (req, res) => {
    validateObjectId(req.params.id)

    const order = await Balance.findById(req.params.id)
    if (!order) throw createError(404)
    if (order.status === 'REJECTED') throw createError(400)

    await order.reject()
    sendPushNotification({title: 'Qəbul olunmadı!', body: 'Balans qəbul olunmadı!', pushToken: order.user.expoPushToken, data: {orderId: order._id, receiver: order.user}})

    res.sendStatus(200)
})



router.patch(
  '/withdraws/:id/complete',
  ensureRole(['ADMIN']),
  async (req, res) => {
    validateObjectId(req.params.id)

    const order = await Withdraw.findById(req.params.id)
    if (!order) throw createError(404)
    if (order.status === 'COMPLETED') throw createError(400)

    await order.complete()
    sendPushNotification({title: 'Qəbul olundu!', body: 'Çıxarış qəbul olundu!', pushToken: order.user.expoPushToken, data: {orderId: order._id, receiver: order.user}})

    res.sendStatus(200)
})

router.patch(
  '/withdraws/:id/reject',
  ensureRole(['ADMIN']),
  async (req, res) => {
    validateObjectId(req.params.id)

    const order = await Withdraw.findById(req.params.id)
    if (!order) throw createError(404)
    if (order.status === 'REJECTED') throw createError(400)

    await order.reject()
    sendPushNotification({title: 'Qəbul olunmadı!', body: 'Çıxarış qəbul olunmadı!', pushToken: order.user.expoPushToken, data: {orderId: order._id, receiver: order.user}})

    res.sendStatus(200)
})


router.patch(
  '/deposits/:id/complete',
  ensureRole(['ADMIN']),
  async (req, res) => {
    validateObjectId(req.params.id)

    const order = await Deposit.findById(req.params.id)
    if (!order) throw createError(404)
    if (order.status === 'COMPLETED') throw createError(400)

    await order.complete()
    sendPushNotification({title: 'Qəbul olundu!', body: 'Deposit qəbul olundu!', pushToken: order.user.expoPushToken, data: {orderId: order._id, receiver: order.user}})

    res.sendStatus(200)
})

router.patch(
  '/deposits/:id/reject',
  ensureRole(['ADMIN']),
  async (req, res) => {
    validateObjectId(req.params.id)

    const order = await Deposit.findById(req.params.id)
    if (!order) throw createError(404)
    if (order.status === 'REJECTED') throw createError(400)

    await order.reject()
    sendPushNotification({title: 'Qəbul olunmadı!', body: 'Deposit qəbul olunmadı!', pushToken: order.user.expoPushToken, data: {orderId: order._id, receiver: order.user}})

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

router.get(
'/notifications',
ensureRole(['ADMIN']),
async (req, res) => {
  res.json(await Notification.find({ read: false }))
})

router.patch(
  '/notifications/:id/read',
  ensureRole(['ADMIN']),
  async (req, res) => {
    const {id} = req.params

    const notification = await Notification.findById(id)

    notification.read = true
    await notification.save()

    res.sendStatus(200)
})

module.exports = router
