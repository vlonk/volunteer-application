import { useState } from "react";
import "../styles/historyEventBox.css";

//takes in an array parameter event
const HistoryEventBox = ({ event }) => {
    //false, meaning box initialy closed
    const [expanded, setExpanded] = useState(false);

    //event-header: Get event name, data, and location are all initially shown.
    //toggle-button: button on right side of box allows box to expand
    //event-details: event description, urgency, skills, and status are shown when expanded. state changes to true once expanded.
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
                <p><strong>Skills:</strong> {event.skills.join(", ")}</p>
                <p><strong>Status:</strong> {event.status}</p>
                </div>
            )}
        </div>
        );
    };

export default HistoryEventBox;
