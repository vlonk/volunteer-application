const express = require("express");

const router = express.Router();

const { getAllEvents, getEvent } = require('../controllers/historyController');

// Route for getting all events for a specific user
router.get("/api/user/:userId/events", getAllEvents);

// Route for getting a specific event details
router.get("/api/user/:userId/events/:eventId", getEvent);


module.exports = router