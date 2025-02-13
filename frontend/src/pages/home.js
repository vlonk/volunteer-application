import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/home.css';
import hero from "../assets/kiwi-bird.jpg";

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="home-container">
        {/* Hero Section */}
        <section className="hero-section">
            <div className="hero-container">
            <div className="hero-text">
                <h1>Volunteer App Headline Blah Our Mission Blah</h1>
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Nunc vel odio eu ligula lacinia imperdiet. Sed placerat,
                magna non pellentesque euismod, tellus velit feugiat erat,
                a dictum arcu felis eget elit.
                </p>
                <button className="join-hero-button"
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