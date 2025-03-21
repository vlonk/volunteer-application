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
  const [confirmDeleteNotification, setConfirmDeleteNotification] = useState(null); // To handle delete confirmation
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchNotifications = async () => {
      if (isLoggedIn && userId) {
        try {
          const response = await fetch(`http://localhost:4000/api/user/${userId}/notifications`);
          const data = await response.json();
          if (Array.isArray(data)) {
            setNotifications(data);
          } else {
            setNotifications([]);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
          setNotifications([]);
        }
      }
    };

    fetchNotifications();
  }, [isLoggedIn, userId]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token); // Convert to boolean
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("id");
    setIsLoggedIn(false);
    setNotifications([]);
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await fetch(`http://localhost:4000/api/notification/${notificationId}`, {
        method: "DELETE",
      });
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.notificationid !== notificationId
        )
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Handle delete confirmation logic
  const confirmDeletion = (isConfirmed) => {
    if (isConfirmed && confirmDeleteNotification) {
      handleDeleteNotification(confirmDeleteNotification); // Trigger the deletion
    }
    setConfirmDeleteNotification(null); // Reset the confirmation state
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={kiWe} alt="kiwecare Logo" className="nav-logo" />
        <span className="nav-title">kiwecare</span>
      </div>

      <div className="nav-center">
        <button className="nav-link" onClick={() => navigate("/home")}>
          Home
        </button>
        <button className="nav-link" onClick={() => navigate("/events")}>
          Events
        </button>
        <button className="nav-link" onClick={() => navigate("/events_management")}>
          Events Management
        </button>
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
                  <div
                    key={note.notificationid}
                    className="notification-item"
                    onClick={() => setConfirmDeleteNotification(note.notificationid)} // Set notification to delete
                  >
                    {note.message}
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
            <button
              className="profile-button"
              onClick={() => {
                const userId = localStorage.getItem("userId");
                navigate(`/profile/${userId}`);
              }}
            >
              <FaUserCircle className="profile-icon" />
            </button>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="nav-button-signin" onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button className="nav-button-join" onClick={() => navigate("/signup")}>
              Join
            </button>
          </>
        )}
      </div>

      {/* Delete Confirmation Popup */}
      {confirmDeleteNotification !== null && (
        <div className="confirmation-popup">
          <div className="popup-box">
            <p>Are you sure you want to delete this notification?</p>
            <button onClick={() => confirmDeletion(true)}>Yes</button>
            <button className="cancel" onClick={() => confirmDeletion(false)}>
              No
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
