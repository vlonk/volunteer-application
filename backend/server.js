const express = require('express')
const cors = require('cors')
require('dotenv').config()

// declaring express app itself. app is an express app
const app = express()

//middleware goes here
app.use(express.json());
app.use(cors());

//routes
const profileRoutes = require("./routes/profileRoutes")
const notificationRoutes = require("./routes/notificationRoutes")
const eventsRoutes = require("./routes/eventsRoutes")

//Use the routes here
app.use(profileRoutes)
app.use(notificationRoutes)
app.use(eventsRoutes)

//listen for requests
app.listen(process.env.PORT,() =>{
    console.log('listening on port', process.env.PORT,'!')
})

process.env