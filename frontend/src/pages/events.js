import React from "react";
import { useNavigate } from "react-router-dom";

const Event = () => {

    const navigate = useNavigate();

    return (
        <div>
            <div style={{ display: "grid", justifyContent: "center", alignItems: "center", height: "30vh"}}>
                Test
            </div>
            <div className="central_container" style={{ display: "grid", justifyContent: "center", alignItems: "center", height: "50vh"}}>   

                <button onClick={() => navigate("/home")}>
                    Home
                </button>

            </div>
        </div>
    );
};

export default Event;