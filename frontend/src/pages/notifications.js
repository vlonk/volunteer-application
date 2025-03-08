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

    fetch(`http://localhost:4000/api/user/${userId}/notifications`)
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

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <NotificationBox
              key={index} // Use index or unique ID like notification.notificationId
              notification={notification}
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
