import { useState } from "react";
import "../styles/historyEventBox.css";

// Takes in an array parameter event
const HistoryEventBox = ({ event }) => {
    // false, meaning box initially closed
    const [expanded, setExpanded] = useState(false);

    // Ensure event.skills is an array (fallback to an empty array if undefined)
    const skills = Array.isArray(event.skills) ? event.skills : [];

    return (
        <div className="event-box"> 
            <div className="event-header">
                <div>
                    <h3>{event.name}</h3>
                    <p>{event.date} • {event.location}</p>
                </div>
                <button className="toggle-button" onClick={() => setExpanded(!expanded)}>
                    {expanded ? "Hide Details" : "View Details"}
                </button>
            </div>

            {expanded && (
                <div className="event-details">
                    <p><strong>Description:</strong> {event.description}</p>
                    <p><strong>Urgency:</strong> {event.urgency}</p>
                    <p><strong>Skills:</strong> {skills.join(", ")}</p>
                    <p><strong>Status:</strong> {event.status}</p>
                </div>
            )}
        </div>
    );
};

export default HistoryEventBox;

