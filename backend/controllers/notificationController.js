const fs = require("fs").promises;
const path = require("path");

// Define the actual location of our data
const notificationsFilePath = path.join(__dirname, "../data/notifications.json");

// Read the notifications.json file, parse it into a JS object
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
        const userId = req.params.userId;

        // Filter notifications for the specific user
        const userNotifications = notifications.notifications.filter(
            (notification) => notification.userId === userId
        );

        if (userNotifications.length === 0) {
            return res.status(404).json({ message: "No notifications found for this user" });
        }

        res.json(userNotifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error });
    }
};

// Get a single notification by its ID
const getNotification = async (req, res) => {
    try {
        const notifications = await getNotifications();
        const notificationId = parseInt(req.params.id);

        // Find the notification by ID
        const notification = notifications.notifications.find(
            (n) => n.notificationId === notificationId
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: "Error reading notification data", error });
    }
};

// Delete a notification by its ID
const deleteNotification = async (req, res) => {
    try {
        let notifications = await getNotifications();

        // Ensure notifications is an array
        if (!notifications || !Array.isArray(notifications.notifications)) {
            return res.status(500).json({ message: "Error: notifications data is invalid" });
        }

        const notificationId = parseInt(req.params.id);

        if (isNaN(notificationId)) {
            return res.status(400).json({ message: "Invalid notification ID" });
        }

        // Filter out the notification by ID
        const updatedNotifications = notifications.notifications.filter(
            (n) => n.notificationId !== notificationId
        );

        // If the notification is not found
        if (updatedNotifications.length === notifications.notifications.length) {
            return res.status(404).json({ message: "Notification not found" });
        }

        // Save the updated notifications back to the file
        notifications.notifications = updatedNotifications;
        await saveNotifications(notifications);

        res.json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ message: "Error deleting notification", error: error.message });
    }
};

module.exports = { getAllNotifications, getNotification, deleteNotification };
