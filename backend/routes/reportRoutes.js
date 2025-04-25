const express = require('express');
const router = express.Router();
const { getAllUsers } = require("../controllers/profileController");
const { getAllEventsForUsers, getSelectedEventInfo } = require("../controllers/reportController");

// Fetch all users
router.get("/api/profiles", getAllUsers);

// Fetch events for all users
router.get("/api/reports/all", getAllEventsForUsers);

// Fetch events info based on eventId for report
router.get("/api/event-report/:id", getSelectedEventInfo);

module.exports = router;
