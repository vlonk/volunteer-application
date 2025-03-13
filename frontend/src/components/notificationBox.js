import { useState } from "react";
import "../styles/notificationBox.css";

const NotificationBox = ({ notification, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const confirmDeletion = (isConfirmed) => {
    if (isConfirmed) {
      onDelete(notification.notificationId); // Call the delete function passed down from parent
    }
    setConfirmDelete(false); // Close the confirmation popup
  };

  return (
    <div className="notification-box">
      <div className="notification-header">
        <h3>{notification.message}</h3>
        <p><strong>Time Sent:</strong> {new Date(notification.timestamp).toLocaleString()}</p>
      </div>

      <button className="delete-button" onClick={handleDelete}>Delete</button>

      {confirmDelete && (
        <div className="confirmation-popup">
          <div className="popup-box">
            <p>Are you sure you want to delete this notification?</p>
            <button onClick={() => confirmDeletion(true)}>Yes</button>
            <button className="cancel" onClick={() => confirmDeletion(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBox;
