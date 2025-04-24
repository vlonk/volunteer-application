const express = require('express');
const router = express.Router();
const { getAllUsers } = require("../controllers/profileController");
const { getAllEventsForUsers } = require("../controllers/reportController");

// Fetch all users
router.get("/api/profiles", getAllUsers);

// Fetch events for all users
router.get("/api/reports/all", getAllEventsForUsers);

module.exports = router;
