import { useState, useEffect } from "react";
import NotificationBox from "../components/notificationBox";
import "../styles/notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from backend
  useEffect(() => {
    fetch("http://localhost:4000/api/notifications") // Adjust URL based on your backend setup
      .then(response => response.json())
      .then(data => setNotifications(data))
      .catch(error => console.error("Error fetching notifications:", error));
  }, []);

  // Function to delete a notification via backend
  const deleteNotification = (id) => {
    fetch(`http://localhost:4000/api/notification/${id}`, {
      method: "DELETE",
    })
      .then(response => {
        if (response.ok) {
          setNotifications(notifications.filter(notification => notification.id !== id));
        } else {
          console.error("Failed to delete notification");
        }
      })
      .catch(error => console.error("Error deleting notification:", error));
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <div className="notification-list">
        {notifications.map((notification) => (
          <NotificationBox
            key={notification.id}
            notification={notification}
            onDelete={deleteNotification}
          />
        ))}
      </div>
    </div>
  );
};

export default Notifications;
