import React, { useState, useEffect } from 'react';
import '../styles/report.css';

const VolunteerParticipationReport = () => {
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    // Fetch the volunteer participation report from the backend (this returns JSON)
    fetch('http://localhost:4000/api/volunteer-participation')
      .then(response => response.json())
      .then(data => setVolunteers(data))
      .catch(error => console.error('Error fetching volunteer data:', error));
  }, []);

  const downloadCSV = () => {
    // Prepare the CSV data based on the volunteer data
    const csvRows = [];
    
    // Add CSV headers
    csvRows.push(['Email', 'Events Participated'].join(','));

    // Add each volunteer's data to CSV
    volunteers.forEach(volunteer => {
      const events = volunteer.events.map(event => `${event.title} - ${event.date} - ${event.location}`).join('; ');
      csvRows.push([volunteer.email, events].join(','));
    });

    // Create the CSV string
    const csvData = csvRows.join('\n');

    // Create a Blob with the CSV data and trigger the download
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'volunteer_participation_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up the DOM
  };

  return (
    <div className="report-container">
      <h1>Volunteer Participation Report</h1>
      <button className="download-button" onClick={downloadCSV}>Download CSV</button>
      <table className="report-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Events Participated</th>
          </tr>
        </thead>
        <tbody>
          {volunteers.length > 0 ? (
            volunteers.map((volunteer) => (
              <tr key={volunteer._id}>
                <td>{volunteer.email}</td>
                <td>
                  <ul>
                    {volunteer.events.map((event, index) => (
                      <li key={index}>
                        {event.title} - {new Date(event.date).toLocaleDateString()} - {event.location}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No volunteer data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VolunteerParticipationReport;

