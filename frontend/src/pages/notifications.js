import { useState } from "react";
import NotificationBox from "../components/notificationBox";
import "../styles/notifications.css";

//dummy data, replace when implenting backend. all data gets passed into array of notifcation ovjects
const initialNotifications = [
  { id: 1, title: "Event Signup", description: "You signed up for Beach Cleanup.", time: "Jan 10, 2024, 10:00 AM" },
  { id: 2, title: "Upcoming Event", description: "Food Drive coming up in 2 weeks!", time: "Feb 1, 2024, 2:00 PM" },
  { id: 3, title: "Event Update", description: "Nico's Kiwi Rescue Event updated.", time: "Feb 15, 2024, 3:00 PM" }
];


const Notifications = () => {
  //initialNotfications is to store the inital number of notifs
  const [notifications, setNotifications] = useState(initialNotifications);

  //function for actually deleting a notifcation by id. set state of notifications to inital state minus notif with current id
  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id)); //how we find the exact notif to delete
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
