const mongoose = require("mongoose");


const eventsSchema = new mongoose.Schema({
  title: String,
  location: String,
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

module.exports = mongoose.model('Event', eventsSchema);
