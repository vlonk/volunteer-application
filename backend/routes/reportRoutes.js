const express = require('express');
const router = express.Router();
const { getVolunteerParticipationReport } = require('../controllers/reportController'); // Adjust the import path as necessary

// Route to get the volunteer participation report
router.get('/api/volunteer-participation', getVolunteerParticipationReport);

module.exports = router;
