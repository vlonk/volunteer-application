const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationid: {
    type: String,
    unique: true,
  },
  eventid: {
    type: String,
    required: true
  },
  userid: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Unread', 'Read'],
    default: 'Unread'
  },
  timestamp: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
