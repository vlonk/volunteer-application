import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotificationBox from "../components/notificationBox"; // Assuming you have a component to display each notification
import "../styles/notifications.css";

const Notifications = () => {
  const { id } = useParams(); // Get user ID from URL
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications for the specific user by their userId
    fetch(`http://localhost:4000/api/user/${id}/notifications`) 
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched notifications:", data);
        setNotifications(data || []); // Set the notifications in state
      })
      .catch((error) => console.error("Error fetching notifications:", error));
  }, [id]); // Refetch notifications when the user ID changes

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationBox
              key={notification.notificationId} // Assuming notificationId is unique
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

export default Notifications;
