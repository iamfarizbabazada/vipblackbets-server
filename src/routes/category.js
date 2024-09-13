const _ = require('lodash')
const createError = require('http-errors')
const router = require('express-promise-router')()
const { celebrate, Joi, Segments } = require('celebrate')
const Category = require('../models/category')
const { ensureAuth, ensureRole } = require('../middlewares/auth')
const { validateObjectId } = require('../utils/validate-objectid')

router.get(
  '/',
  async (req, res) => {
    const categories = await Category.find({ isDeleted: false }).sort({ createdAt: 'desc' })
    res.json({ categories })
  })

router.get(
  '/:id',
  ensureAuth,
  async (req, res) => {
    validateObjectId(req.params.id)
    const category = await Category.findById(req.params.id)
    if (!category || category.isDeleted) throw createError(404)

    res.json(category)
  })

router.get(
  '/options',
  ensureAuth,
  async (req, res) => {
    const categories = await Category.find({ isDeleted: false }).sort({ createdAt: 'desc' })
    const options = _.map(categories, (category, index) => ({
      label: category.name,
      value: category._id,
      key: index
    }))

    res.json({ options })
  })

router.get(
  '/slug/:slug',
  ensureAuth,
  async (req, res) => {
    const category = await Category.findBySlug(req.params.slug)
    if (!category || category.isDeleted) throw createError(404)

    res.json(category)
  })

const createCategoryValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    category: Joi.object().keys({
      name: Joi.string().min(3).max(120).required(),
      description: Joi.string(),
      included: Joi.array(Joi.string().valid('SERVICE', 'BLOG', 'PORTFOLIO').min(1)).required()
    })
  })
})

router.post(
  '/',
  ensureRole('ADMIN'),
  createCategoryValidator,
  async (req, res) => {
    await Category.create(req.body.category)
    res.sendStatus(200)
  })

const updateCategoryValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    category: Joi.object().keys({
      name: Joi.string().min(3).max(120),
      description: Joi.string()
    })
  })
})

router.put(
  '/:id',
  ensureRole('ADMIN'),
  updateCategoryValidator,
  async (req, res) => {
    validateObjectId(req.params.id)

    await Category.findByIdAndUpdate(req.params.id, req.body.category)

    res.sendStatus(200)
  })

const includeCategoryValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    element: Joi.string().valid('SERVICE', 'PORTFOLIO', 'BLOG')
  })
})

router.patch(
  '/:id/include',
  ensureRole('ADMIN'),
  includeCategoryValidator,
  async (req, res) => {
    validateObjectId(req.params.id)

    const category = Category.findById(req.params.id)
    if (!category || category.isDeleted) throw createError(404)

    await category.includeNewElement(req.body.element)

    res.sendStatus(200)
  })

router.delete(
  '/:id',
  ensureRole(['ADMIN']),
  async (req, res) => {
    validateObjectId(req.params.id)

    const category = await Category.findById(req.params.id)
    if (!category || category.isDeleted) throw createError(404)

    await category.delete()

    res.sendStatus(200)
  })

router.delete(
  '/:id/include/:element',
  ensureRole('ADMIN'),
  async (req, res) => {
    const category = Category.findById(req.params.id)
    if (!category || category.isDeleted) throw createError(404)

    await category.removeIncludedElement(req.params.element)

    res.sendStatus(200)
  })

module.exports = router
