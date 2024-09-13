const createError = require('http-errors')
const { v4 } = require('uuid')
const router = require('express-promise-router')()
const { celebrate, Joi, Segments } = require('celebrate')
const redisClient = require('../redis')
const { NEWSLETTER_MAIL } = require('../configs/event-names')
const User = require('../models/user')
const Blog = require('../models/blog')
const Category = require('../models/category')
const { ensureRole } = require('../middlewares/auth')
const upload = require('../middlewares/upload')
const { validateObjectId, bulkValidateObjectId } = require('../utils/validate-objectid')

const paginationValidator = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().positive().integer().default(1),
    limit: Joi.number().positive().integer().default(20)
  })
})

router.get(
  '/',
  ensureRole(['ADMIN', 'EDITOR']),
  paginationValidator,
  async (req, res) => {
    const { page, limit } = req.query
    const skip = (page - 1) * limit

    const total = await Blog.countDocuments({ status: { $ne: 'DELETED' }, isDeleted: false })
    const blogs = await Blog.find({ status: { $ne: 'DELETED' }, isDeleted: false })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: 'desc' })

    res.json({ blogs, total })
  })

router.get(
  '/:id',
  ensureRole(['ADMIN', 'EDITOR']),
  async (req, res) => {
    validateObjectId(req.params.id)

    const blog = await Blog.findById(req.params.id)
    if (!blog || blog.isDeleted) throw createError(404)

    res.json(blog)
  })

router.get(
  '/featured',
  async (req, res) => {
    const blogs = await Blog.findFeatured().sort({ createdAt: 'desc' })
    res.json(blogs)
  })

router.get(
  '/published',
  paginationValidator,
  async (req, res) => {
    const { page, limit } = req.query
    const skip = (page - 1) * limit

    const total = await Blog.countDocuments({
      status: 'PUBLISHED',
      isDeleted: false
    })
    const blogs = await Blog.findPublished().limit(limit).skip(skip).sort({ createdAt: 'desc' })

    res.json({
      blogs,
      total
    })
  })

router.get(
  '/published/:slug',
  async (req, res) => {
    const blog = await Blog.findPublishedBySlug(req.params.slug)
    if (!blog) throw createError(404)

    const similarBlogs = await blog.loadSimilarBlogs()

    res.json({ blog, similarBlogs })
  })

const createBlogValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    blog: Joi.object().keys({
      title: Joi.string().trim().min(3).max(120).required(),
      body: Joi.string(),
      status: Joi.string().valid('DRAFT').default('DRAFT').forbidden(),
      categories: Joi.array().items(Joi.string().min(1)).required(),
      cover: Joi.any()
    })
  })
})

async function isCategoriesExists (req, res, next) {
  const categoryIds = req.body.blog.categories
  bulkValidateObjectId(categoryIds)

  const isExists = await Category.exists({ _id: { $in: categoryIds }, included: { $in: 'BLOG' } })

  if (!isExists) {
    next(createError(400))
  }

  next()
}

router.post(
  '/',
  ensureRole(['EDITOR']),
  upload.single('cover'),
  createBlogValidator,
  isCategoriesExists,
  async (req, res) => {
    const newBlog = new Blog(req.body.blog)
    await newBlog.save()

    req.user.addBlog(newBlog)
    await req.user.save()

    res.sendStatus(200)
  })

const updateBlogValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    blog: Joi.object().keys({
      title: Joi.string().trim().min(3).max(120),
      body: Joi.string(),
      categories: Joi.array().items(Joi.string().min(1)),
      cover: Joi.any(),
      isFeatured: Joi.boolean()
    })
  })
})

router.put(
  '/:id',
  ensureRole(['ADMIN', 'EDITOR']),
  upload.single('cover'),
  updateBlogValidator,
  isCategoriesExists,
  async (req, res) => {
    validateObjectId(req.params.id)

    await Blog.findByIdAndUpdate(req.params.id, req.body.blog)

    res.sendStatus(200)
  })

router.patch(
  '/:id/publish',
  ensureRole(['ADMIN', 'EDITOR']),
  async (req, res) => {
    validateObjectId(req.params.id)

    const blog = await Blog.findById(req.params.id)
    if (!blog || blog.isDeleted) throw createError(404)
    if (blog.status === 'PUBLISHED') throw createError(400)

    await blog.publish()

    const message = {
      id: v4(),
      payload: {
        blogId: blog._id,
        subject: 'New Blog',
        author: blog.author.name
      },
      timestamp: new Date()
    }

    redisClient.publish(NEWSLETTER_MAIL, JSON.stringify(message))

    res.sendStatus(200)
  })

router.delete(
  '/:id',
  ensureRole(['ADMIN', 'EDITOR']),
  async (req, res) => {
    validateObjectId(req.params.id)

    const blog = await Blog.findById(req.params.id)
    if (!blog || blog.isDeleted) throw createError(404)

    await blog.delete()

    const user = await User.findById(blog.author._id)
    user.removeBlog(blog)
    await user.save()

    res.sendStatus(200)
  })

module.exports = router
