import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import kiWe from "../assets/kiWe.png";
import { FaBell, FaUserCircle } from "react-icons/fa";

const NavBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchNotifications = async () => {
      if (isLoggedIn && userId) {
        try {
          const response = await fetch(`http://localhost:4000/api/user/${userId}/notifications`);
          const data = await response.json();
          setNotifications(data || []);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    fetchNotifications();
  }, [isLoggedIn, userId]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setNotifications([]);
    navigate("/login");
  };

  const handleDeleteNotification = (notificationId) => {
    fetch(`http://localhost:4000/api/notification/${notificationId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Immediately update the state and remove the notification from the UI
          setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.notificationId !== notificationId)
          );
          // Close the dropdown after the notification is deleted
          setIsOpen(false);
        } else {
          console.error("Failed to delete notification");
        }
      })
      .catch((error) => {
        console.error("Error deleting notification:", error);
      });
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={kiWe} alt="kiwecare Logo" className="nav-logo" />
        <span className="nav-title">kiwecare</span>
      </div>

      <div className="nav-center">
        <button className="nav-link" onClick={() => navigate("/home")}>Home</button>
        <button className="nav-link" onClick={() => navigate("/events")}>Events</button>
        <button className="nav-link" onClick={() => navigate("/events_management")}>Events Management</button>
      </div>

      <div className="nav-right">
        <div className="notification-wrapper" onClick={toggleDropdown}>
          <FaBell className="notification-icon" />
          {notifications.length > 0 && (
            <span className="notification-count">{notifications.length}</span>
          )}

          {isOpen && (
            <div className="notification-dropdown">
              {notifications.length > 0 ? (
                notifications.map((note) => (
                  <div key={note.notificationId} className="notification-item">
                    <p>{note.message}</p>
                    <button onClick={() => handleDeleteNotification(note.notificationId)} className="delete-button">
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <div className="notification-item">No notifications</div>
              )}
            </div>
          )}
        </div>

        {isLoggedIn ? (
          <>
            <button className="profile-button" onClick={() => navigate(`/profile/${userId}`)}>
              <FaUserCircle className="profile-icon" />
            </button>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="nav-button-signin" onClick={() => navigate("/login")}>Sign In</button>
            <button className="nav-button-join" onClick={() => navigate("/signup")}>Join</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
