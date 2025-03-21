const mongoose = require('mongoose');

const eventHistorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  events: [
    {
      eventId: { type: String, required: true },
      name: { type: String, required: true },
      date: { type: String}, 
      location: { type: String, required: true },
      description: { type: String, required: true },
      status: { type: String, required: true },
      skills: {type: [String], required: true}
    }
  ]
});

const EventHistory = mongoose.model('EventHistory', eventHistorySchema);

module.exports = EventHistory;

