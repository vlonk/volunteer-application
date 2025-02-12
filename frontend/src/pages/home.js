import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/home.css';
import kiWe from "../assets/kiWe.png";

const Home = () => {
    const navigate = useNavigate();

    // main container
    return (
    <div className="home-container">
        {/* navigation bar */}
        <nav className="navbar">
        {/* logo and title */}
        <div className="nav-left">
            <img
            src={kiWe}
            alt="kiwecare Logo"
            className="nav-logo"
            />
            <span className="nav-title">kiwecare</span>
        </div>
        {/* buttons */}
        <div className="nav-center">
            <button
            className="nav-link"
            onClick={() => navigate("/")}
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
    </div>
    );
};

export default Home;