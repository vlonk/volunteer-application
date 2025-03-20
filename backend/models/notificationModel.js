const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId: {
    type: Number,
    required: true,
    unique: true
  },
  eventId: {
    type: String,
    required: true
  },
  userId: {
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

module.exports = mongoose.model("Notificiation", notificationSchema);


