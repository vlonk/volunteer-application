import React, { useState, useEffect } from "react";
import "../styles/report.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Reports() {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL;
        const response = await fetch(`${API_URL}/api/reports/all`);
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

  const downloadPDF = () => {
    const input = document.getElementById("report-to-pdf");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // if content spans multiple pages
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
      <div className="table-box">
        <table className="table table-bordered" id="report-to-pdf">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Event Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((user, userIndex) => (
              user.events.length > 0 ? (
                user.events.map((event, eventIndex) => (
                  <tr key={`${userIndex}-${eventIndex}`}>
                    <td>{eventIndex === 0 ? user.userId : ""}</td>
                    <td>{eventIndex === 0 ? user.name : ""}</td>
                    <td>{event.name}</td>
                    <td>{event.status}</td>
                  </tr>
                ))
              ) : (
                <tr key={`empty-${userIndex}`}>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
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
