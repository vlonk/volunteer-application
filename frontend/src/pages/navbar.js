import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import kiWe from "../assets/kiWe.png";

const NavBar = () => {
    const navigate = useNavigate();

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

