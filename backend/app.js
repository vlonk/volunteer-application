const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));

const corsOptions = {
  origin: 'https://d381dee9723cth.cloudfront.net', // your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

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
app.use(reportRoutes);

module.exports = app;
