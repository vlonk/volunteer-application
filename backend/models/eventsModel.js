const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  description: String,
  date: String,
  urgency: String,
  number: String,
  email: String, 
  address: String,
  address2: String,
  city: String,
  state: String,
  zip: String,
  skills: [String],
});

module.exports = mongoose.model("Event", eventsSchema);
