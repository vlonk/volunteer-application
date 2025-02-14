import { useState } from "react";
import "../styles/notificationBox.css";

const NotificationBox = ({ notification, onDelete }) => {
    //for state of confirm delete pop up, when false, its not there
    const [confirmDelete, setConfirmDelete] = useState(false);

    //func for when user clicks delete button, makes the pop up show up
    const handleDelete = () => {
        setConfirmDelete(true);
    };

    //notification.id is to get the index or id of notifcation from the list of notifications to delete the right one
    const confirmDeletion = (isConfirmed) => {
        if (isConfirmed) {
            onDelete(notification.id); //Pass the ID back to delete the notification
        }
        setConfirmDelete(false); //when setConfrimDelete is false, the notifcation box will disappear
    };

  return (
    <div className="notification-box">
        <div className="notification-header">
            <h3>{notification.title}</h3>
            <p>{notification.description}</p>
            <p><strong>Time Sent:</strong> {notification.time}</p>
        </div>

        <button className="delete-button" onClick={handleDelete}>
            Delete
        </button>

        {/*Confirmation Pop-up stuff*/}
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
