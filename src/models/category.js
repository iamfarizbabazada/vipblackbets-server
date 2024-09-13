const mongoose = require('mongoose')
const slugify = require('slugify')
const { deleteObject } = require('../configs/custom-mongoose-objects')

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 120,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String
  },
  included: [{
    type: String,
    enum: ['SERVICE', 'BLOG', 'PORTFOLIO']
  }],
  ...deleteObject
}, {
  timestamps: true
})

class Category {
  static findBySlug (slug) {
    return this.findOne({ slug })
  }

  static findByTags (tags = []) {
    return this.find({ featured: true, tags: { $in: tags } })
  }

  includeNewElement (element) {
    this.included.push(element)
    return this.save()
  }

  removeIncludedElement (element) {
    this.included.pull(element)
    return this.save()
  }

  delete () {
    this.deletedAt = Date.now()
    this.isDeleted = true
    return this.save()
  }
}

categorySchema.loadClass(Category)

categorySchema.pre('save', async function (next) {
  const self = this

  if (!self.slug) {
    const slug = slugify(self.name)
    this.set({ slug })
  }

  next()
})

module.exports = mongoose.model('Category', categorySchema, 'categories')
