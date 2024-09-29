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

userSchema.plugin(mongooseDelete, {
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

userSchema.loadClass(User)


userSchema.virtual('avatarURL').get(function() {
  if(!this.avatar) return null
  return `${BASE_URL}/uploads/${this.avatar}`;
});

module.exports = mongoose.model('User', userSchema, 'users')
