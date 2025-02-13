import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/home.css';
import kiWe from "../assets/kiWe.png";
import hero from "../assets/kiwi-bird.jpg";

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

        <section className="hero-section">
        {/* A wrapper (container) to limit width and center content */}
        <div className="hero-container">
            <div className="hero-text">
            <h1>Volunteer App Headline Blah Our Mission Blah</h1>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Nunc vel odio eu ligula lacinia imperdiet. Sed placerat,
                magna non pellentesque euismod, tellus velit feugiat erat,
                a dictum arcu felis eget elit.
            </p>
            <button
                className="join-hero-button"
                onClick={() => navigate("/signup")}
            >
                Join
            </button>
            </div>
            <div className="hero-image">
            <img
                src={hero}
                alt="hero section"
            />
            </div>
        </div>
        </section>

    </div>
    );
};

export default Home;