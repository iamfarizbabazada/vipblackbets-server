const mongoose = require('mongoose')
const mongooseAutopopulate = require('mongoose-autopopulate')
const mongooseDelete = require('mongoose-delete')
const { BASE_URL } = require('../configs/env')


const statuses = ['PENDING', 'COMPLETED', 'REJECTED']
const DEFAULT_STATUS = "PENDING"

const balanceSchema = new mongoose.Schema({
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
  paymentType: {
    type: String,
    required: true
  },
  file: {
    type: String,
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

class Balance {
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

balanceSchema.plugin(mongooseAutopopulate)
balanceSchema.plugin(mongooseDelete, {
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
balanceSchema.loadClass(Balance)

balanceSchema.virtual('fileURL').get(function() {
  return `${BASE_URL}/uploads/${this.file}`;
});


module.exports = mongoose.model('Balance', balanceSchema, 'balances')
