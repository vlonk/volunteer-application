const express = require('express');
const router = express.Router();
const { getAllUsersWithEventHistory } = require('../controllers/reportController'); // Import the controller

// Route to get all users with event history
router.get('/users/event-history', getAllUsersWithEventHistory);

module.exports = router;
