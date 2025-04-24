import React, { useState, useEffect } from "react";
import "../styles/report.css";

function Reports() {
  const [reportData, setReportData] = useState([]);

  // Fetch data for all users and their event histories
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/reports/all');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        console.log('Fetched report data:', result);
        setReportData(result);
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchReportData();
  }, []);

  // Function to download data as CSV
  const downloadCSV = () => {
    const headers = ["User ID", "Name", "Events"];
    const rows = reportData.map(user => [
      user.userId,
      user.name,
      user.events
        .map(event => `${event.name} (${event.status})`)  // Add status to the event
        .join("\n"),  // Add newline between events
    ]);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\r\n";
    rows.forEach(row => {
      csvContent += row.join(",") + "\r\n";
    });

    // Create a downloadable link and trigger the download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "volunteer_event_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <h2>Volunteer Event Report</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Events</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((user, index) => (
            <tr key={index}>
              <td>{user.userId}</td>
              <td>{user.name}</td>
              <td>
                {user.events.length > 0 ? (
                  user.events.map((event, idx) => (
                    <div key={idx}>
                      {event.name} ({event.status})
                    </div>
                  ))
                ) : (
                  <div>None</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={downloadCSV}>
        Download as CSV
      </button>
    </div>
  );
}

export default Reports;
