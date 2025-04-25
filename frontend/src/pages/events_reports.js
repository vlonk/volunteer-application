import React, { useState, useEffect } from "react";
import "../styles/report.css";

const EventsReports = () => {
    const [eventsArray, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState("");
    const [reportData, setReportData] = useState([]);
    
      useEffect(() => {
        const fetchReportData = async () => {
          try {
            const response = await fetch(`http://localhost:4000/api/event-report/${selectedEvent._id}`);
            if (!response.ok) throw new Error("Failed to fetch data");
            const result = await response.json();
            setReportData(result);
            console.log("Report data:", result);

          } catch (error) {
            console.error("Error fetching report data:", error);
          }
        };
        fetchReportData();
      }, [selectedEvent]);

      const downloadCSV = () => {
        const headers = ["User ID", "Name", "Event Name", "Status"];
        let rows = [];
    
        reportData.forEach(user => {
          if (user.events.length === 0) {
            rows.push([user.userId, user.name, "—", "—"]);
          } else {
            user.events.forEach((event, idx) => {
              rows.push([
                idx === 0 ? user.userId : "", // only first row gets the userId
                idx === 0 ? user.name : "",   // only first row gets the name
                event.name,
                event.status
              ]);
            });
          }
        });
    
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += headers.join(",") + "\r\n";
        rows.forEach(row => {
          csvContent += row.join(",") + "\r\n";
        });
    
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "volunteer_event_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

    const DropdownMenu = ({title, options, onSelect, selectedItem}) => {
        const [isOpen, setIsOpen] = useState(false);
      
        const toggleDropdown = () => {
          setIsOpen(!isOpen); // toggles the dropdown open and closed
        };
      
        const handleSelect = (option) => {
          onSelect(option);
          setIsOpen(false);
        }
    
        return (
          <div className="dropdown">
            <button className="dropdown-button" onClick={toggleDropdown}>
            {selectedItem ? (selectedItem.name || selectedItem.title) : title}  {/* this keeps the option picked on the button for both user and event */}
            </button>
            {isOpen && (
              <div className="dropdown-content">
                {options.length > 0 ? (
                options.map((option) => (
                  <button key={option.id} onClick={() => handleSelect(option)}>
                    {option.name || option.title}
                  </button>
                ))):(
                  <p>No options available</p>
              )}
              </div>
            )}
          </div>
        );
      };

    // fetch events from backend
    useEffect(() => {
        console.log("Fetching events")
        fetch("http://localhost:4000/api/all-events")
          .then(response => {
            console.log("Response status:", response.status); // Check response status
    
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          
          .then(data => {
            console.log("Fetched events:", data); // checking data struct
            
            // if the data is an object with event IDs as keys, convert it to an array
            const eventsArray = Object.keys(data).map(key => ({
              id: key,  // use the key as the event's id
              ...data[key]  // spread the rest of the event properties
            }));
            
            setEvents(eventsArray); // set the state with the events array
          })
          .catch(error => console.error("Error fetching events in front:", error));
      }, []);

    return (
        <div className = "container">
        <h2>Events Reports</h2>
        <DropdownMenu
            title={"Choose an event"}
            options={eventsArray}
            onSelect={setSelectedEvent} // updates the selected event
            selectedItem= {selectedEvent}
          />
          {selectedEvent &&(

            <div className="table-box">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Description</th>
                  <th>Volunteer Name</th>
                  <th>Assignment</th>
                </tr>
              </thead>
              <tbody>
                {reportData && reportData.volunteers && reportData.volunteers.length > 0 ? (
                    reportData.volunteers.map((volunteer, index) => (
                      <tr key={index}>
                        <td>{reportData.title}</td>
                        <td>{reportData.description}</td>
                        <td>{volunteer.name}</td>
                        <td>{volunteer.assignment}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                          <td>{reportData?.title}</td>
                        <td>{reportData?.description}</td>
                        <td>—</td>
                        <td>No volunteers assigned</td>
                    </tr>
                  )
                }
              </tbody>
            </table>
            <button className="btn btn-primary" onClick={downloadCSV}>
        Download as CSV
      </button>
          </div>
          
          )} 
        </div>
    );
}

export default EventsReports;