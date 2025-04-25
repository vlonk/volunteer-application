import React, { useState, useEffect } from "react";
import "../styles/report.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Reports() {
  const [reportData, setReportData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/reports/all");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setReportData(result);
      } catch (error) {
        console.error("Error fetching report data:", error);
      }
    };
    fetchReportData();
  }, []);

  const downloadCSV = () => {
    const headers = ["Event Name", "Status"];
    let rows = [];

    const data = selectedUser ? [selectedUser] : reportData;

    data.forEach(user => {
      if (user.events.length === 0) {
        rows.push(["—", "—"]);
      } else {
        user.events.forEach(event => {
          rows.push([event.name, event.status]);
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

  const downloadPDF = () => {
    const input = document.getElementById("report-to-pdf");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("volunteer_event_report.pdf");
    });
  };

  return (
    <div className="container">
      <h2>Volunteer Participation Report</h2>

      <div className="dropdown mb-3">
        <label>Select a user:</label>
        <select
          onChange={(e) => {
            const selected = reportData.find(user => user.userId === e.target.value);
            setSelectedUser(selected);
          }}
        >
          <option value="">-- All Users --</option>
          {reportData.map(user => (
            <option key={user.userId} value={user.userId}>
              {user.name} ({user.userId})
            </option>
          ))}
        </select>
      </div>

      <div className="table-box">
        <table className="table table-bordered" id="report-to-pdf">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(selectedUser ? [selectedUser] : reportData).map((user, userIndex) => (
              user.events.length > 0 ? (
                user.events.map((event, eventIndex) => (
                  <tr key={`${userIndex}-${eventIndex}`}>
                    <td>{event.name}</td>
                    <td>{event.status}</td>
                  </tr>
                ))
              ) : (
                <tr key={`empty-${userIndex}`}>
                  <td>—</td>
                  <td>—</td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn-primary" onClick={downloadCSV}>
        Download as CSV
      </button>
      <button className="btn btn-secondary" onClick={downloadPDF}>
        Download as PDF
      </button>
    </div>
  );
}

export default Reports;