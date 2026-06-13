import React, { useState } from "react";
import "./report.css";

export default function Reports() {
  const [interval, setInterval] = useState("");
  const [hasReport, setHasReport] = useState(false);
  return (
    <>
      {/* REPORTS PAGE */}
      <div className="reports-container">

        <h1 className="reports-title">REPORTS</h1>
        <p className="reports-subtitle">View, generate, and download reports</p>

        <div className="dropdown-wrapper">
          <select
            className="interval-dropdown"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          >
            <option value="">Select Report Interval</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      {!hasReport ? (
  <div className="no-report">
    <p className="no-report-text">
      No report yet.<br />
      Generate your report from the dashboard.
    </p>
  </div>
) : (
  <div className="report-preview-card">

    <div className="chart-placeholder">
      <div className="fake-line"></div>
      <div className="fake-table">
        <div className="row"></div>
        <div className="row"></div>
        <div className="row"></div>
      </div>
    </div>

    <button className="download-btn">
      Download PDF
    </button>

  </div>
)}
      </div>

    </>
  );
}
