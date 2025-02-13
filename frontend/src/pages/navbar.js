import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import kiWe from "../assets/kiWe.png";
import {FaBell, FaUserCircle } from "react-icons/fa";

const NavBar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const [notifications] = useState([
        "not #1",
        "not #2",
        "not #3",
        "not #4"
    ]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
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

            <button
                className="profile-button"
                onClick={() => navigate("/profile")}
            >
                <FaUserCircle className="profile-icon" />
            </button>
        
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
        </div>
    </nav>
    );
};

export default NavBar;

