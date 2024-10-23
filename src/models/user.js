const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const { Expo } = require('expo-server-sdk')
const mongooseAutopopulate = require('mongoose-autopopulate')
const mongooseDelete = require('mongoose-delete')
const { BASE_URL } = require('../configs/env')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 60
  },
  role: {
    type: String,
    enum: ['ADMIN', 'USER'],
    default: 'USER'
  },
  avatar: {
    type: String,
    trim: true,
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerifiedAt: {
    type: Date,
    default: null
  },
  expoPushToken: {
    type: String,
  },
  currentBalance: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

class User {
  static checkEmailVerified (email) {
    return this.findOne({ email })
  }

  static checkDeleted (email) {
    return this.findOne({ email, deleted: true })
  }

  updateExpoToken(token) {
    if(Expo.isExpoPushToken(token)) {
      this.expoPushToken = token
      return this.save()
    } else {
      return Promise.reject(new Error('Token invalid!'))
    }
  }

  increaseBalance(amount) {
    this.currentBalance = this.currentBalance + amount
    return this.save()
  }

  decreaseBalance(amount) {
    if(amount > this.currentBalance) {
      throw new Error("No Balance")
    }
    
    this.currentBalance = this.currentBalance - amount
    return this.save()
  }

  changeAvatar (url) {
    this.avatar = url
    return this.save()
  }

  verify() {
    this.emailVerified = true
    this.emailVerifiedAt = Date.now()
    return this.save()
  }

  // addBlog (blog) {
  //   this.blogs.push(blog)
  //   blog.author = this
  // }

  // loadBlogs () {
  //   return this.populate('blogs')
  // }

  // removeBlog (blog) {
  //   this.blogs.pull(blog)

  //   // const indexToRemove = this.blogs.findIndex(blogId => blogId === blog._id)

  //   // if (indexToRemove === -1) return null

  //   // this.blogs.splice(indexToRemove, 1)
  // }
}

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  lastLoginField: true,
})

userSchema.plugin(mongooseAutopopulate)

userSchema.plugin(mongooseDelete)

userSchema.loadClass(User)


userSchema.virtual('avatarURL').get(function() {
  if(!this.avatar) return null
  return `${BASE_URL}/uploads/${this.avatar}`;
});

userSchema.virtual('totalDeposit', {
  ref: 'Deposit', // Reference the 'Deposit' collection
  localField: '_id', // Use the User's _id field
  foreignField: 'user', // Match with the 'user' field in the Deposit model
  justOne: false, // Returns an array (we'll sum it later)
  options: {
    autopopulate: { select: 'amount' }, // Ensure we select only the 'amount' field
  },
}).get(function (deposits) {
  return deposits?.reduce((sum, deposit) => sum + deposit.amount, 0) || 0;
});

// Virtual field to calculate the total withdrawal amount
userSchema.virtual('totalWithdraw', {
  ref: 'Withdraw', // Reference the 'Withdraw' collection
  localField: '_id',
  foreignField: 'user',
  justOne: false,
  options: {
    autopopulate: { select: 'amount' }, // Ensure we select only the 'amount' field
  },
}).get(function (withdraws) {
  return withdraws?.reduce((sum, withdraw) => sum + withdraw.amount, 0) || 0;
});

userSchema.virtual('totalWithdrawResidual', {
  ref: 'Withdraw', // Reference the 'Withdraw' collection
  localField: '_id',
  foreignField: 'user',
  justOne: false,
  options: {
    autopopulate: { select: 'residual' }, // Ensure we select only the 'amount' field
  },
}).get(function (withdraws) {
  return withdraws?.reduce((sum, withdraw) => sum + withdraw.residual, 0) || 0;
});

module.exports = mongoose.model('User', userSchema, 'users')
