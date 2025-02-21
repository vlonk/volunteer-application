const fs = require("fs").promises;
const path = require("path");

// Define the actual location of our data
const notificationsFilePath = path.join(__dirname, "../data/notifications.json");

// Read the notifications.json file, parse into JS object
const getNotifications = async () => {
    const data = await fs.readFile(notificationsFilePath, "utf8");
    return JSON.parse(data);
};

// Save info to notifications.json
const saveNotifications = async (notifications) => {
    await fs.writeFile(notificationsFilePath, JSON.stringify(notifications, null, 2));
};

// Get list of all notifications
const getAllNotifications = async (req, res) => {
    try {
        const notifications = await getNotifications();
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error });
    }
};

// Get a single notification
const getNotification = async (req, res) => {
    try {
        const notifications = await getNotifications();
        const notification = notifications[req.params.id]; //Find user with 'id' from URL params
  
        if (!notification) {
            return res.status(404).json({ message: "User not found" });
        }
  
        res.json(notification);
    } 
    catch (error) {
        res.status(500).json({ message: "Error reading user data", error });
    }
}

// Delete a notification
const deleteNotification = async (req, res) => {
    try {
        let notifications = await getNotifications();
        const notificationId = parseInt(req.params.id);

        notifications = notifications.filter(n => n.id !== notificationId);

        await saveNotifications(notifications);
        res.json({ message: "Notification deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting notification", error });
    }
};

module.exports = { getAllNotifications, getNotification, deleteNotification };