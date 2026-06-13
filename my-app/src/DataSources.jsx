import React from "react";
import "./DataSources.css";
import { Link } from "react-router-dom";

const DataSources = ({ uploadedFiles }) => {

  const daysLeft = (date) => {
    const expireDate = new Date(date);
    expireDate.setDate(expireDate.getDate() + 30);
    const diff = Math.ceil((expireDate - new Date()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} days left` : "Expired";
  };

  return (
    <div className="datasources">
      

      <div className="datasource-wrapper"><br></br>
        <h1>DATA SOURCES</h1>
        <p className="subtitle">Files you have uploaded so far</p>

        {uploadedFiles.length === 0 ? (
          <div className="empty-box">📂 No data files yet.</div>
        ) : (
          <div className="file-grid">
            {uploadedFiles.map((file, i) => (
              <div key={i} className="file-card">
                <div className="file-type">📄</div>
                <h4>{file.name}</h4>
                <p className="file-size">
                  {(file.size / 1000).toFixed(1)} KB
                </p>
                <span className="status ready">Ready</span>
                <span className="expiry">{daysLeft(new Date())}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSources;
