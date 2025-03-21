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

// Pre-save middleware to generate a unique notificationid
notificationSchema.pre('save', async function (next) {
  if (!this.notificationid) {
    this.notificationid = new mongoose.Types.ObjectId().toString(); // Generate a unique string ID
  }
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);
