import React, { useEffect, useState } from "react";
import NotificationBox from "../components/notificationBox";
import "../styles/notifications.css";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      console.error("User is not logged in.");
      return;
    }

    fetch(`http://localhost:4000/api/user/${userId}/notifications`)
      .then((response) => response.json())
      .then((data) => {
        setNotifications(data || []);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  }, [userId]);

  const handleDeleteNotification = (notificationId) => {
    fetch(`http://localhost:4000/api/notification/${notificationId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Remove the notification from the UI
          setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.notificationId !== notificationId)
          );
        } else {
          console.error("Failed to delete notification");
        }
      })
      .catch((error) => {
        console.error("Error deleting notification:", error);
      });
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationBox
              key={notification.notificationId}
              notification={notification}
              onDelete={handleDeleteNotification}
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
