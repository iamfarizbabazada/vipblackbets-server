const createError = require('http-errors')
const router = require('express-promise-router')()
const { celebrate, Joi, Segments } = require('celebrate')
const Subscriber = require('../models/subscriber')
const { ensureNoActiveSession } = require('../middlewares/auth')

const createSubscriberValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    subscriber: Joi.object().keys({
      email: Joi.string().email().required()
    })
  })
})

router.post(
  '/',
  ensureNoActiveSession,
  createSubscriberValidator,
  async (req, res) => {
    const isSubscribed = await Subscriber.exists({ email: req.body.subscriber })

    if (isSubscribed) throw createError(400)

    await Subscriber.create(req.body.subscriber)

    res.sendStatus(200)
  })

module.exports = router
