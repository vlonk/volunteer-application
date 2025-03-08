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
        if (userId) {
            fetch(`http://localhost:4000/api/user/${userId}/notifications`)
                .then(response => response.json())
                .then(data => {
                    console.log("Fetched notifications:", data);
                    setNotifications(data || []);
                })
                .catch(error => console.error("Error fetching notifications:", error));
        }
    }, [userId]); // Fetch notifications when userId is available

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
                {/* if there are notifications then show the badge */}
                {notifications.length > 0 && (
                <span className="notification-count">
                    {notifications.length}
                </span>
                )}

                {/* if its open then open */}
                {isOpen && (
                <div className="notification-dropdown">
                    {notifications.map((note, i) => (
                    <div key={i} className="notification-item">
                        {note}
                    </div>
                    ))}
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

