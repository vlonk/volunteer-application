const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  address: String,
  address2: String,
  city: String,
  state: String,
  zip: String,
  number: String,
  emergency: String,
  email: String,
  skills: [String], 
  preferences: [String], 
  role: String,
  password: String,
  availability: [String], 
  eventhistoryId: String,
});

module.exports = mongoose.model("User", userSchema);

