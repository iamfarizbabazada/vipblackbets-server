const createError = require('http-errors')
const router = require('express-promise-router')()
const { celebrate, Joi, Segments } = require('celebrate')
const Quote = require('../models/quote')
const { ensureRole, ensureNoActiveSession } = require('../middlewares/auth')
const { validateObjectId } = require('../utils/validate-objectid')

router.get(
  '/',
  ensureRole('ADMIN'),
  async (req, res) => {
    const quotes = await Quote.find({})
    res.json({ quotes })
  })

router.get(
  '/:id',
  ensureRole('ADMIN'),
  async (req, res) => {
    validateObjectId(req.params.id)

    const quote = await Quote.findById(req.params.id)
    if (!quote) throw createError(404)

    res.json({ quote })
  })

const quoteValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    quote: Joi.object().keys({
      name: Joi.string().min(3).max(60).trim().required(),
      body: Joi.string(),
      phone: Joi.string().required(),
      included: Joi.array(Joi.string().min(1)).required()
    })
  })
})

router.post(
  '/',
  ensureNoActiveSession,
  quoteValidator,
  async (req, res) => {
    await Quote.create(req.body.quote)
    res.sendStatus(200)
  })

router.patch(
  '/:id/complete',
  ensureRole('ADMIN'),
  async (req, res) => {
    validateObjectId(req.params.id)

    const quote = await Quote.findById(req.params.id)
    if (!quote || quote.isDeleted) throw createError(404)

    if (quote.isCompleted) throw createError(400)

    await quote.complete()

    res.sendStatus(200)
  })

router.delete(
  '/:id',
  ensureRole('ADMIN'),
  async (req, res) => {
    validateObjectId(req.params.id)

    const quote = await Quote.findById(req.params.id)
    if (!quote || quote.isDeleted) throw createError(404)

    await quote.delete()

    res.sendStatus(200)
  })

module.exports = router
