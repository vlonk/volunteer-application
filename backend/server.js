const express = require('express')
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');

// declaring express app itself. app is an express app
const app = express()

// Connect the database to the backend
mongoose.connect(process.env.MONGODB_URI, {
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));

//middleware goes here
app.use(express.json());
app.use(cors());

//auth route
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


//routes
const profileRoutes = require("./routes/profileRoutes")
const notificationRoutes = require("./routes/notificationRoutes")
const historyRoutes = require("./routes/historyRoutes")
const eventsRoutes = require("./routes/eventsRoutes")
const reportRoutes = require('./routes/reportRoutes');

//Use the routes here
app.use(profileRoutes)
app.use(notificationRoutes)
app.use(historyRoutes)
app.use(eventsRoutes)
app.use('/api/reports', reportRoutes);


//listen for requests
app.listen(process.env.PORT,() =>{
    console.log('listening on port', process.env.PORT,'!')
})

process.env