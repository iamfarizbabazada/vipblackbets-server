const mongoose = require('mongoose')
const mongooseAutopopulate = require('mongoose-autopopulate')
const mongooseDelete = require('mongoose-delete')

const statuses = ['PENDING', 'COMPLETED', 'REJECTED']
const DEFAULT_STATUS = "PENDING"

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: statuses,
    default: DEFAULT_STATUS
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true,
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
  provider: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

class Order {
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

orderSchema.plugin(mongooseAutopopulate)
orderSchema.plugin(mongooseDelete, {
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
orderSchema.loadClass(Order)



module.exports = mongoose.model('Order', orderSchema, 'orders')
