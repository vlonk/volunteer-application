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
  const [confirmDeleteNotification, setConfirmDeleteNotification] = useState(null);
  const userId = localStorage.getItem("userId");

  // Check JWT for admin role
  const token = localStorage.getItem("authToken");
  let isAdmin = false;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isAdmin = payload.role === 'admin';
    } catch {}
  }

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL;
    const fetchNotifications = async () => {
      if (isLoggedIn && userId) {
        try {
          const response = await fetch(`${API_URL}/api/user/${userId}/notifications`);
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
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setNotifications([]);
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      await fetch(`${API_URL}/api/notification/${notificationId}`, { method: "DELETE" });
      setNotifications(prev => prev.filter(n => n.notificationid !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const confirmDeletion = (isConfirmed) => {
    if (isConfirmed && confirmDeleteNotification) {
      handleDeleteNotification(confirmDeleteNotification);
    }
    setConfirmDeleteNotification(null);
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
        {isAdmin && (
          <button className="nav-link" onClick={() => navigate("/reports")}>Reports</button>
        )}
      </div>

      <div className="nav-right">
        <div className="notification-wrapper" onClick={toggleDropdown}>
          <FaBell className="notification-icon" />
          {notifications.length > 0 && <span className="notification-count">{notifications.length}</span>}
          {isOpen && (
            <div className="notification-dropdown">
              {notifications.length > 0 ? (
                notifications.map(note => (
                  <div
                    key={note.notificationid}
                    className="notification-item"
                    onClick={() => setConfirmDeleteNotification(note.notificationid)}
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

      {confirmDeleteNotification !== null && (
        <div className="confirmation-popup">
          <div className="popup-box">
            <p>Are you sure you want to delete this notification?</p>
            <button onClick={() => confirmDeletion(true)}>Yes</button>
            <button className="cancel" onClick={() => confirmDeletion(false)}>No</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
