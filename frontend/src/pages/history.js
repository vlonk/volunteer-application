import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HistoryEventBox from "../components/historyEventBox";
import "../styles/history.css";

const History = () => {
    const { id } = useParams(); // Get user ID from URL
    const [eventHistory, setEventHistory] = useState([]);

    useEffect(() => {
      fetch(`http://localhost:4000/api/user/${id}/events`) 
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched event history:", data);
          // If the data is just an array, no need for the `historyKey`
          setEventHistory(data || []); // Use the direct array
        })
        .catch((error) => console.error("Error fetching event history:", error));
    }, [id]);
  

    return (
        <div className="history-container">
            <h2>Event History</h2>
            <div className="event-list">
                {eventHistory.length > 0 ? (
                    eventHistory.map((event, index) => (
                        <HistoryEventBox key={index} event={event} />
                    ))
                ) : (
                    <p>No event history available.</p>
                )}
            </div>
        </div>
    );
};

export default History;




