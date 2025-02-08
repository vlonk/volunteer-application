import React from "react";
import { useNavigate } from "react-router-dom";

const Event = () => {

    const navigate = useNavigate();

    return (
        <div style={{display: "flex", justifyContent: "center"}}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "10vh" }}>
                Test
            </div>
            <div className="central_container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>   

                <button onClick={() => navigate("/home")}>
                    Home
                </button>

            </div>
        </div>
    );
};

export default Event;