import React, { useState, useEffect } from 'react';
import '../styles/report.css';

const UserEventHistory = () => {
  const [users, setUsers] = useState([]);

  // Fetch the users with their event history from the backend
  useEffect(() => {
    fetch('http://localhost:4000/api/users/event-history')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  // Function to download the data as a CSV file
  const downloadCSV = () => {
    // Prepare the CSV data
    const csvRows = [];
    
    // Add CSV headers
    csvRows.push(['User ID', 'User Name', 'Event ID', 'Event Name'].join(','));

    // Add each user's data to the CSV
    users.forEach(user => {
      const eventHistory = user.eventHistory ? `${user.eventHistory.eventId} - ${user.eventHistory.eventName}` : 'No Event History';
      csvRows.push([user.id, user.name, eventHistory].join(','));
    });

    // Create a CSV string
    const csvData = csvRows.join('\n');

    // Create a Blob with the CSV data and trigger the download
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users_event_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up the DOM
  };

  return (
    <div className="report-container">
      <h1>User Event History</h1>
      <button className="download-button" onClick={downloadCSV}>Download CSV</button>
      <table className="report-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>User Name</th>
            <th>Event ID</th>
            <th>Event Name</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.eventHistory ? user.eventHistory.eventId : 'No Event History'}</td>
                <td>{user.eventHistory ? user.eventHistory.eventName : 'No Event History'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No user data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserEventHistory;
