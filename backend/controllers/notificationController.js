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

module.exports = { getAllNotifications, getNotification, deleteNotification };
