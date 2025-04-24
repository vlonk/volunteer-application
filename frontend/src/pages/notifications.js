import { useEffect, useState } from "react";
import NotificationBox from "../components/notificationBox"; // Assuming NotificationBox is your component to display individual notifications
import "../styles/notifications.css";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("userId"); // Get the user ID from localStorage

  useEffect(() => {
    // Ensure user is logged in and userId is present
    if (!userId) {
      console.error("User is not logged in or userId is missing");
      return; // Prevent fetching if user is not logged in
    }

    const API_URL = process.env.REACT_APP_API_URL;
    fetch(`${API_URL}/api/user/${userId}/notifications`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched notifications:", data);
        setNotifications(data || []); // If no notifications, set an empty array
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        setNotifications([]); // Reset notifications on error
      });
  }, [userId]); // Re-fetch if userId changes (although it should be static after login)

  // Handle deleting a notification
  const handleDeleteNotification = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const response = await fetch(`${API_URL}/api/notification/${id}`, {
        method: "DELETE", // DELETE request to server
      });

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      // Remove deleted notification from state
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.notificationid !== id)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationBox
              key={notification.notificationid} // Use unique ID like notification.notificationId
              notification={notification}
              onDelete={handleDeleteNotification}  // Pass the onDelete function as a prop
            />
          ))
        ) : (
          <p>No notifications available.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
