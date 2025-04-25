import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import hero from "../assets/kiwi-bird.jpg";

const Home = () => {
    const navigate = useNavigate();

    return (
    <div className="home-container">
      {/* hero section */}
        <section className="hero-section">
        <div className="hero-container">
            <div className="hero-text">
            <h1>Volunteer Today, Change Tomorrow</h1>
            <p>
            Our mission is to empower our community by connecting volunteers with service opportunities that match them best. 
            We provide a secure, intuitive platform that matches each individual’s skills and availability with the needs of local organizations. 
            Join us today. 
            Make an impact on your community.
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

      {/* upcoming events */}
        <section className="upcoming-section">
        <h2>Upcoming</h2>
        <div className="cards-container">
          {/* first card */}
            <div className="event-card">
            <h3>Senior Home Volunteering</h3>
            <p>Join us for a day of fun volunteering at the Houston senior home.</p>
            <div className="event-info">
                <span className="event-date">Feb 25</span>
                <button
                className="event-join-button"
                onClick={() => navigate("/events")}
                >
                Join
                </button>
            </div>
            </div>

          {/* second card */}
            <div className="event-card highlight">
            <h3>Garden Center Volunteering</h3>
            <p>Join us for a day of fun volunteering at the Houston garden center.</p>
            <div className="event-info">
                <span className="event-date">Feb 25</span>
                <button
                className="event-join-button"
                onClick={() => navigate("/events")}
                >
                Join
                </button>
            </div>
            </div>
            {/* third card */}
            <div className="event-card">
            <h3>Half Marathon Volunteering</h3>
            <p>Join us for a day of fun volunteering at the Houston half marathon.</p>
            <div className="event-info">
                <span className="event-date">Feb 25</span>
                <button
                className="event-join-button"
                onClick={() => navigate("/events")}
                >
                Join
                </button>
            </div>
            </div>
        </div>
        </section>
    </div>
    );
};

export default Home;
