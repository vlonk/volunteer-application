const express = require("express")

const router = express.Router();

const { getAllNotifications, getNotification, deleteNotification} = require('../controllers/notificationController');

//for getting all notification
router.get("/api/notifications", getAllNotifications);
//route for getting the notification profile
router.get("/api/notification/:id", getNotification);
//route to delete a notification profile
router.delete("/api/notification/:id", deleteNotification);

module.exports=router;