const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

// Connect the database to the backend
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require("./routes/profileRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const historyRoutes = require("./routes/historyRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const reportRoutes = require('./routes/reportRoutes');

app.use('/api/auth', authRoutes);
app.use(profileRoutes);
app.use(notificationRoutes);
app.use(historyRoutes);
app.use(eventsRoutes);
//app.use('/api/reports', reportRoutes);

module.exports = app;
