const mongoose = require('mongoose')
const slugify = require('slugify')
const mongooseAutopopulate = require('mongoose-autopopulate')
const { deleteObject } = require('../configs/custom-mongoose-objects')

const statuses = ['DRAFT', 'PUBLISHED', 'DELETED']

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlenth: 3,
    maxlength: 120
  },
  body: String,
  status: {
    type: String,
    enum: statuses,
    default: 'DRAFT'
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true,
    required: true
  },
  categories: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'BlogCategory',
    autopopulate: true,
    required: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  cover: String,
  ...deleteObject
}, {
  timestamps: true
})

class Blog {
  static findBySlug (slug) {
    return this.findOne({ slug, status: { $ne: 'DELETED' } })
  }

  static findFeatured () {
    return this.find({ featured: true, status: 'PUBLISHED', isDeleted: false })
  }

  static findPublished () {
    return this.find({ status: 'PUBLISHED', isDeleted: false })
  }

  static findPublishedBySlug (slug) {
    return this.findOne({ slug, status: 'PUBLISHED', isDeleted: false })
  }

  loadSimilarBlogs () {
    const similarCategoryIds = this.category.map(category => category._id)

    return this.model('Blog').find({
      _id: { $ne: this._id },
      status: { $ne: 'DELETED' },
      isDeleted: false,
      category: { $in: similarCategoryIds }
    })
  }

  publish () {
    this.status = 'PUBLISHED'
    return this.save()
  }

  delete () {
    this.deletedAt = Date.now()
    this.isDeleted = true
    this.status = 'DELETED'
    return this.save()
  }
}

blogSchema.plugin(mongooseAutopopulate)
blogSchema.loadClass(Blog)

blogSchema.pre('save', async function (next) {
  const self = this

  if (!self.slug) {
    const slug = slugify(self.title)
    this.set({ slug })
  }

  next()
})

module.exports = mongoose.model('Blog', blogSchema, 'blogs')
