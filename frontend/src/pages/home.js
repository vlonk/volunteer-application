import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
          <button onClick={() => navigate("/signup")}>
                Signup
            </button>
            <button onClick={() => navigate("/login")}>
                Login
            </button>
            <button onClick={() => navigate("/events")}>
                Events
            </button>
           
        </>
    );
};

export default Home;