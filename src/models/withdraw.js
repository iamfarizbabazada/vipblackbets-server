const mongoose = require('mongoose')
const mongooseAutopopulate = require('mongoose-autopopulate')
const mongooseDelete = require('mongoose-delete')
const { BASE_URL } = require('../configs/env')


const statuses = ['PENDING', 'COMPLETED', 'REJECTED']
const DEFAULT_STATUS = "PENDING"

const withdrawSchema = new mongoose.Schema({
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
  cardNumber: {
    type: String,
    required: true
  },
  withdrawId: {
    type: String,
    required: true,
  },
  withdrawCode: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
  // toJSON: { virtuals: true },
  // toObject: { virtuals: true }
})

class Withdraw {
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

withdrawSchema.plugin(mongooseAutopopulate)
withdrawSchema.plugin(mongooseDelete, {
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
withdrawSchema.loadClass(Withdraw)

// withdrawSchema.virtual('fileURL').get(function() {
//   return `${BASE_URL}/uploads/${this.file}`;
// });


module.exports = mongoose.model('Withdraw', withdrawSchema, 'withdrawes')
