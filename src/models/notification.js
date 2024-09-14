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
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});


module.exports = mongoose.model('Notification', notificationSchema);
