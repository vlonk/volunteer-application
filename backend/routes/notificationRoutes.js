const express = require('express');
const router = express.Router();
const { getAllNotifications, getNotification, deleteNotification, postNotification } = require('../controllers/notificationController');

// Route to get all notifications for a user
router.get('/api/user/:userid/notifications', getAllNotifications);

// Route to get a single notification by its ID
router.get('/api/notification/:id', getNotification);

router.post('/api/notification/:id', postNotification);

// Route to delete a notification by its ID
router.delete('/api/notification/:id', deleteNotification);

module.exports = router;
