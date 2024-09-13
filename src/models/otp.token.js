const mongoose = require('mongoose')
const mongooseAutopopulate = require('mongoose-autopopulate')
const mongooseDelete = require('mongoose-delete')
const Otp = require('../utils/crypto').Otp
const moment = require('moment')
const { MAIL_EXPIRATION_MINUTES } = require('../configs/env')

const otpTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: true
  },
  salt: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  expiredAt: {
    type: Date,
    required: true
  },
}, {
  timestamps: true
})

class OtpToken {
  static async findByUser(user) {
    return this.findOne({user}).sort({createdAt: -1})
  }

  static async generate(user) {
    const {otp, salt, hash} = Otp.generate()
    const expiredAt = moment().add(MAIL_EXPIRATION_MINUTES, 'minutes').toDate()

    await this.save({ user, salt, hash, expiredAt })
    return { rawOtp: otp, expiredAt: expiredAt }    
  }

  verify(inputOtp) {
    return Otp.verify(inputOtp, this.salt, this.hash)
  }

  checkIsExpired() {
    return moment().isAfter(this.expiredAt)
  }
}

otpTokenSchema.plugin(mongooseAutopopulate)

otpTokenSchema.plugin(mongooseDelete, {
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

otpTokenSchema.loadClass(OtpToken)

module.exports = mongoose.model('OtpToken', otpTokenSchema, 'otp-tokens')
