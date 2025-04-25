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
  volunteersList: [
    { // updated this to be an array of objects, will be used for reports
      id: { type: String, required: true }, // stores user ID
      name: { type: String, required: true }, // stores user's name
      assignment: { type: String, required: true } // stores volunteer's assignment
    }
  ],  // this is initialized in the backend, does not get populated until people sign up
},);

module.exports = mongoose.model('Event', eventsSchema);
