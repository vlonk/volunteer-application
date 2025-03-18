import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import kiWe from "../assets/kiWe.png";
import {FaBell, FaUserCircle } from "react-icons/fa";

const NavBar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const userId = localStorage.getItem("userId"); // Get user ID after login/signup

    useEffect(() => {
        const fetchNotifications = async () => {
            if (isLoggedIn && userId) {
                try {
                    const response = await fetch(`http://localhost:4000/api/user/${userId}/notifications`);
                    const data = await response.json();
                    console.log("Fetched notifications:", data);
                    setNotifications(data || []);
                } catch (error) {
                    console.error("Error fetching notifications:", error);
                }
            }
        };

        fetchNotifications();
    }, [isLoggedIn, userId]); // Fetch notifications only when isLoggedIn or userId changes


    // Check if the user is logged in on mount and handle login state
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("authToken");
            setIsLoggedIn(!!token); // Convert to boolean
        };

        checkAuth(); // Run once on mount
        window.addEventListener("storage", checkAuth); // Listen for changes in localStorage

        return () => {
            window.removeEventListener("storage", checkAuth); // Cleanup listener
        };
    }, []); // Only run this effect once on mount

    // const [notifications] = useState([
    //     "not #1",
    //     "not #2",
    //     "not #3",
    //     "not #4"
    // ]);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("authToken");
            setIsLoggedIn(!!token); // Convert to boolean
        };
    
        checkAuth(); // Run once on mount
    
        window.addEventListener("storage", checkAuth);
    
        return () => {
            window.removeEventListener("storage", checkAuth); // Cleanup listener
        };
    }, []);
    
    
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');  // Remove auth token
        localStorage.removeItem('id');  // Remove user id
        setIsLoggedIn(false);  // Update login status
        setNotifications([]); // Clear notifications on logout
        navigate('/login');  // Redirect to login page after logout
    };
    return (
    <nav className="navbar">
        <div className="nav-left">
        <img
            src={kiWe}
            alt="kiwecare Logo"
            className="nav-logo"
        />
        <span className="nav-title">kiwecare</span>
        </div>

        <div className="nav-center">
        <button
            className="nav-link"
            onClick={() => navigate("/home")}
        >
            Home
        </button>
        <button
            className="nav-link"
            onClick={() => navigate("/events")}
        >
            Events
        </button>
        <button
            className="nav-link"
            onClick={() => navigate("/events_management")}
        >
            Events Management
        </button>
        </div>

        <div className="nav-right">
                <div className="notification-wrapper" onClick={toggleDropdown}>
                    <FaBell className="notification-icon" />
                    {/* Show notification count if there are notifications */}
                    {notifications.length > 0 && (
                        <span className="notification-count">
                            {notifications.length}
                        </span>
                    )}

                    {/* Show notifications if dropdown is open */}
                    {isOpen && (
                        <div className="notification-dropdown">
                            {Array.isArray(notifications) && notifications.length > 0 ? (
                                notifications.map((note, i) => (
                                    <div key={note.notificationId || i} className="notification-item">
                                        {note.message} {/* Displaying only the message */}
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
                            const userId = localStorage.getItem('userId');  // Get the correct user ID
                            navigate(`/profile/${userId}`);  // Use the stored userId in the URL
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
                        <button
                            className="nav-button-signin"
                            onClick={() => navigate("/login")}
                        >
                            Sign In
                        </button>
                        <button
                            className="nav-button-join"
                            onClick={() => navigate("/signup")}
                        >
                            Join
                        </button>
                    </>
                )}
        </div>
    </nav>
    );
};

export default NavBar;

