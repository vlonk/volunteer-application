const express = require("express");

const router = express.Router();

const { getAllNotifications, getNotification, deleteNotification } = require('../controllers/notificationController');

// Route for getting all notifications for a specific user
router.get("/api/user/:userId/notifications", getAllNotifications);

// Route for getting a single notification by its ID
router.get("/api/notification/:id", getNotification);

// Route to delete a specific notification by its ID
router.delete("/api/notification/:id", deleteNotification);

module.exports = router;
