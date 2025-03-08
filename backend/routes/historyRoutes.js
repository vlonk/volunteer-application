const express = require("express");

const router = express.Router();

const { getAllEvents, getEvent, updateUserHistory } = require('../controllers/historyController');

// Route for getting all events for a specific user
router.get("/api/user/:userId/events", getAllEvents);

// Route for getting a specific event details
router.get("/api/user/:userId/events/:eventId", getEvent);

// Route for updating user event history
router.put("/api/user/:userId/events", updateUserHistory);


module.exports = router