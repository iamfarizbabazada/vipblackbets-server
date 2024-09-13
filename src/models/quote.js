const mongoose = require('mongoose')
const mongooseAutopopulate = require('mongoose-autopopulate')
const { deleteObject } = require('../configs/custom-mongoose-objects')

const quoteSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 60,
    trim: true,
    required: true
  },
  body: String,
  phone: {
    type: String,
    required: true
  },
  included: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    autopopulate: true,
    required: true
  }],
  isCompleted: {
    type: Boolean,
    default: false
  },
  ...deleteObject
}, {
  timestamps: true
})

class Quote {
  delete () {
    this.deletedAt = Date.now()
    this.isDeleted = true
    return this.save()
  }

  complete () {
    this.isCompleted = true
    return this.save()
  }
}

quoteSchema.plugin(mongooseAutopopulate)
quoteSchema.loadClass(Quote)

module.exports = mongoose.model('Quote', quoteSchema, 'quotes')
