const mongoose = require('mongoose');

// Define the notification schema
const notificationSchema = new mongoose.Schema({
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  status: {
    type: String,
    enum: ['INFO', 'WARN', 'ERR', 'SUCCESS'], // Define types of notifications
    default: 'INFO'
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('Notification', notificationSchema);
