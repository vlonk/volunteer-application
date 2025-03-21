const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationid: {
    type: String,        // Unique notification identifier (can be a string)
    required: true,
    unique: true
  },
  eventid: {
    type: String,        // Event ID the notification is related to
    required: true
  },
  userid: {
    type: String,        // User ID that the notification belongs to
    required: true
  },
  message: {
    type: String,        // Notification message
    required: true
  },
  status: {
    type: String,        // Status (Unread or Read)
    enum: ['Unread', 'Read'],
    default: 'Unread'
  },
  timestamp: {
    type: Date,          // Timestamp when notification was created
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);

