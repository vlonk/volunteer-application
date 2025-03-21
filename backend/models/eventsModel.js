const mongoose = require("mongoose");


const eventsSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  urgency: String,
  number: String,
  email: String, 
  address: String,
  city: String,
  state: String,
  zip: String,
  selectedSkills: [String],
},);

const Event = mongoose.model('Event', eventsSchema);

module.exports = Event;