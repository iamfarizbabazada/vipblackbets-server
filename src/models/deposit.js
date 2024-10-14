const mongoose = require('mongoose')
const mongooseAutopopulate = require('mongoose-autopopulate')
const mongooseDelete = require('mongoose-delete')
// const { BASE_URL } = require('../configs/env')


const statuses = ['PENDING', 'COMPLETED', 'REJECTED']
const DEFAULT_STATUS = "PENDING"

const depositSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: statuses,
    default: DEFAULT_STATUS
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: {select: ['name', 'email', 'avatar']},
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  withdrawId: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  // toJSON: { virtuals: true },
  // toObject: { virtuals: true }
})

class Deposit {
  static findByStatus (status) {
    return this.find({ status })
  }
  complete () {
    this.status = 'COMPLETED'
    return this.save()
  }

  reject () {
    this.status = 'REJECTED'
    return this.save()
  }
}

depositSchema.plugin(mongooseAutopopulate)
depositSchema.plugin(mongooseDelete, {
  overrideMethods: [
    'aggregate',
    'countDocuments',
    'find',
    'findOne',
    'findOneAndUpdate',
    'update',
    'updateMany',
    'updateOne'
  ]
})
depositSchema.loadClass(Deposit)

// depositSchema.virtual('fileURL').get(function() {
//   return `${BASE_URL}/uploads/${this.file}`;
// });


module.exports = mongoose.model('Deposit', depositSchema, 'deposites')
