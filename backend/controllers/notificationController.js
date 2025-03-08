const fs = require("fs").promises;
const path = require("path");

// Define the actual location of our data
const notificationsFilePath = path.join(__dirname, "../data/notifications.json");

// Read the notifications.json file, parse it into a JS object
const getNotifications = async () => {
    try {
        const data = await fs.readFile(notificationsFilePath, "utf8");
        // Check if the data is empty, return an empty object if so
        if (!data) {
            return { notifications: [] };
        }
        return JSON.parse(data);
    } catch (error) {
        throw new Error("Error reading notifications data: " + error.message);
    }
};

const saveNotifications = async (notifications) => {
    const formattedNotifications = { notifications: notifications.notifications }; // Ensure this matches your test expectations
    await fs.writeFile(notificationsFilePath, JSON.stringify(formattedNotifications, null, 2));
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

const getNotification = async (req, res) => {
    try {
        const notifications = await getNotifications();
        const notificationId = parseInt(req.params.id, 10);

        if (isNaN(notificationId)) {
            return res.status(400).json({ message: "Invalid notification ID format" });
        }

        const notification = notifications.notifications.find(
            (n) => n.notificationId === notificationId
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: "Error reading notification data", error: error.message });
    }
};


// Delete a notification by its ID
const deleteNotification = async (req, res) => {
    try {
        let notifications = await getNotifications();
        const notificationId = parseInt(req.params.id, 10);

        if (isNaN(notificationId)) {
            return res.status(400).json({ message: "Invalid notification ID format" });
        }

        const updatedNotifications = notifications.notifications.filter(
            (n) => n.notificationId !== notificationId
        );

        if (!notifications || !Array.isArray(notifications.notifications)) {
            return res.status(500).json({ message: "Error deleting notification", error: new Error("notifications data is invalid") });
        }
        

        notifications.notifications = updatedNotifications;
        await saveNotifications(notifications);

        res.json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ message: "Error deleting notification", error: error.message });
    }
};

module.exports = { getAllNotifications, getNotification, deleteNotification };
