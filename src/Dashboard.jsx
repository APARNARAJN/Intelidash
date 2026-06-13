import React, { useState } from 'react';
import './App.css';
import { Link } from "react-router-dom";


const Dashboard = ({ uploadedFiles, setUploadedFiles }) => {
  const [widgets, setWidgets] = useState([]);
  const [draggedWidget, setDraggedWidget] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const widgetLibrary = [
    { id: 1, name: 'Revenue Trends' },
    { id: 2, name: 'Sales by Category' },
    { id: 3, name: 'Customer Acquisition' },
    { id: 4, name: 'Real-time KPIs' },
    { id: 5, name: 'Geographic Sales Distribution' },
  ];

  const handleDragStart = (widget) => setDraggedWidget(widget);

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedWidget) {
      setWidgets((prev) => [...prev, { ...draggedWidget, uid: Date.now() }]);
      setDraggedWidget(null);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleRemoveWidget = (uid) =>
    setWidgets((prev) => prev.filter((w) => w.uid !== uid));

  const handleFileUpload = (files) => {
    const filesArray = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...filesArray]);
  };

  const handleRemoveFile = (name) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev - 1);
    if (dragCounter <= 1) setIsDragging(false);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="dashboard">
      <header className="navbar">
        <div className="logo">IntelliDash</div>
        <nav>
          <Link to="/">My Dashboards</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/datasources">Data Sources</Link>
          <Link to="/settings">Settings</Link>
        </nav>
        <input type="text" className="search" placeholder="Search" />
      </header>

      <div className="dashboard-body">
        <aside className="sidebar"><br></br><br></br>
          <h3>AI Chat</h3>
          <input type="text" placeholder="Ask me anything..." />
          <ul>
            <li>Revenue last quarter?</li>
            <li>Sales by category</li>
            <li>New customers</li>
            <li>Live KPIs</li>
          </ul>
        </aside>

        <main className="main"><br></br><br></br>
          <h1>My Dashboard</h1>

          {/* File Upload Bar */}
          <div
            className={`file-upload-bar ${isDragging ? 'dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            <input
              type="file"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="file-input"
            />
            <p>{isDragging ? 'Drop files here...' : 'Drag & drop files or click to upload'}</p>
            <div className="uploaded-badges">
              {uploadedFiles.map((file) => (
                <span key={file.name} className="badge">
                  {file.name}
                  <button onClick={() => handleRemoveFile(file.name)}>✕</button>
                </span>
              ))}
            </div>
          </div>

          <div className="canvas" onDrop={handleDrop} onDragOver={handleDragOver}>
            {widgets.length === 0 ? (
              <div className="placeholder">
                <p>Start building your dashboard</p>
              </div>
            ) : (
              widgets.map((w) => (
                <div key={w.uid} className="widget">
                  <div className="widget-header">
                    <h4>{w.name}</h4>
                    <button className="remove-btn" onClick={() => handleRemoveWidget(w.uid)}>
                      ✕
                    </button>
                  </div>
                  <p>Widget content for {w.name}</p>
                </div>
              ))
            )}
          </div>

          <div className="widget-library">
            <h2>Widget Library</h2>
            <div className="widgets">
              {widgetLibrary.map((w) => (
                <div
                  key={w.id}
                  draggable
                  className="widget-item"
                  onDragStart={() => handleDragStart(w)}
                >
                  {w.name}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;