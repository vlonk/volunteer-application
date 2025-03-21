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
  volunteersList: {type: [String], default: []},  // this is initialized in the backend, does not get populated until people sign up
},);

module.exports = mongoose.model('Event', eventsSchema);
