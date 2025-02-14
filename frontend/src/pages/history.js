import HistoryEventBox from "../components/historyEventBox";
import "../styles/history.css";

//Temporary dummy events
const eventHistory = [
  { name: "Beach Cleanup", date: "Jan 20, 2024", location: "Houston, TX", description: "Help clean up the beach.", urgency: "Medium", skills: ["Teamwork", "Physical Work"], status: "Participated" },
  { name: "Food Drive", date: "Feb 15, 2024", location: "Community Center", description: "Assist in food distribution.", urgency: "High", skills: ["Organizing", "Customer Service"], status: "No Show" },
  { name: "Nico's Kiwi Rescue Event", date: "Feb 20, 2024", location: "Nico's house, TX", description: "save the kiwis at the expense of your life", urgency: "High", skills:["Heavy lifting", "Teamwork"], status: "pending"}
];

//use .map() function to iterate through all eventHistory list
const History = () => {
  return (
    <div className="history-container">
      <h2>Event History</h2>
      <div className="event-list">
        {eventHistory.map((event, index) => (
          <HistoryEventBox key={index} event={event} />
        ))}
      </div>
    </div>
  );
};

export default History;


