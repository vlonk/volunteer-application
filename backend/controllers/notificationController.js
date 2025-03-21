const Notification = require('../models/notificationModel');

// Get all notifications for a user
const getAllNotifications = async (req, res) => {
  try {
    const { userid } = req.params;  // Get userId from params
    
    const notifications = await Notification.find({ userid });

    if (!notifications.length) {
      return res.status(404).json({ message: 'No notifications found for this user' });
    }

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Get a notification by its ID
const getNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({ notificationid: id });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notification', error: error.message });
  }
};

// Delete a notification by ID
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotification = await Notification.findOneAndDelete({ notificationid: id });

    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
};

// Create a new notification for a user
const postNotification = async (req, res) => {
  try {
    const { userid, message, eventid } = req.body;  // Get userId, message, and eventId from the request body

    // Check if required fields are missing
    if (!userid || !message || !eventid) {
      return res.status(400).json({
        message: "Missing required fields: userid, message, or eventid"
      });
    }

    // Generate a unique notification ID using the current timestamp and a random number
    
    //console.log("Generated notificationId:", notificationId);  // Debug log

    // Create a new notification object
    const newNotification = new Notification({
      //notificationid: notificationid,  // Unique notification ID
      userid,  // User ID that the notification is for
      message, // Notification message
      eventid, // Event ID the notification is associated with
      timestamp: new Date()  // Set the timestamp of when the notification was created
    });

    // Save the new notification to the database
    await newNotification.save();

    // Respond with success message and the created notification
    res.status(201).json({
      message: "Notification created successfully",
      notification: newNotification
    });

  } catch (error) {
    console.error("Error creating notification:", error);  // Debug log for the error
    // Handle errors and send error message
    res.status(500).json({
      message: "Error creating notification",
      error: error.message
    });
  }
};

module.exports = { getAllNotifications, getNotification, deleteNotification, postNotification };
