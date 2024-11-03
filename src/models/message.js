const mongoose = require('mongoose')
const { BASE_URL } = require('../configs/env')
const mongooseAutoPopulate= require('mongoose-autopopulate')

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    autopopulate: {select: ['name', 'email']},
  },
  
  file: {
    type: String,
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

messageSchema.plugin(mongooseAutoPopulate)

messageSchema.virtual('fileURL').get(function() {
  if(!this.file) return null
  return `${BASE_URL}/uploads/${this.file}`;
});

module.exports = mongoose.model('Message', messageSchema, 'messages')
