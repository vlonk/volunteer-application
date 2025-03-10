const express = require('express')
const cors = require('cors')
require('dotenv').config()

// declaring express app itself. app is an express app
const app = express()

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

//Use the routes here
app.use(profileRoutes)
app.use(notificationRoutes)
app.use(historyRoutes)
app.use(eventsRoutes)

//listen for requests
app.listen(process.env.PORT,() =>{
    console.log('listening on port', process.env.PORT,'!')
})

process.env