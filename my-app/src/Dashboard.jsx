import React, { useState } from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";

const SUGGESTED_QUESTIONS = [
  "Total revenue by region",
  "Monthly revenue trend",
  "Sales by category",
  "Top products by revenue",
  "Revenue by product",
];

const Dashboard = ({ uploadedFiles, setUploadedFiles }) => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const askAI = async (q) => {
    const query = q || question;
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setChartData(null);

    try {
      const res = await fetch("http://localhost:5000/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Something went wrong");

      setChartData(json);
      setQuestion("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") askAI();
  };

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

  const renderChart = () => {
    if (!chartData || !chartData.data || chartData.data.length === 0) return null;

    const { data, chart_type, x_key, y_key, question: q, sql } = chartData;

    // Normalize keys — fallback to first two keys in data if x_key/y_key are generic
    const dataKeys = Object.keys(data[0]);
    const xKey = dataKeys.includes(x_key) ? x_key : dataKeys[0];
    const yKey = dataKeys.includes(y_key) ? y_key : dataKeys[1];
    const normalizedData = data.map((row) => ({
      ...row,
      [yKey]: Number.isNaN(Number(row[yKey])) ? row[yKey] : Number(row[yKey]),
    }));

    return (
      <div className="chart-result">
        <div className="chart-header">
          <h3>{q}</h3>
          <span className="sql-badge" title={sql}>SQL ✓</span>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          {chart_type === "line" ? (
            <LineChart data={normalizedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e323d" />
              <XAxis dataKey={xKey} tick={{ fill: "#aaa", fontSize: 12 }} />
              <YAxis tick={{ fill: "#aaa", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "#1a1d27", border: "1px solid #2e323d", borderRadius: 8 }}
                labelStyle={{ color: "#4da3ff" }}
                itemStyle={{ color: "#e4e6eb" }}
              />
              <Line type="monotone" dataKey={yKey} stroke="#4da3ff" strokeWidth={2} dot={{ fill: "#4da3ff" }} />
            </LineChart>
          ) : (
            <BarChart data={normalizedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e323d" />
              <XAxis dataKey={xKey} tick={{ fill: "#aaa", fontSize: 12 }} />
              <YAxis tick={{ fill: "#aaa", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "#1a1d27", border: "1px solid #2e323d", borderRadius: 8 }}
                labelStyle={{ color: "#4da3ff" }}
                itemStyle={{ color: "#e4e6eb" }}
              />
              <Bar dataKey={yKey} fill="#4da3ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>

        <div className="data-table">
          <table>
            <thead>
              <tr>
                {dataKeys.map((k) => <th key={k}>{k}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {dataKeys.map((k) => <td key={k}>{row[k]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-body">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <h3>AI Chat</h3>
          <div className="chat-input-wrap">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="ask-btn"
              onClick={() => askAI()}
              disabled={loading}
            >
              {loading ? "..." : "Ask"}
            </button>
          </div>

          <p className="suggestions-label">Try asking:</p>
          <ul>
            {SUGGESTED_QUESTIONS.map((q) => (
              <li key={q} onClick={() => askAI(q)}>
                {q}
              </li>
            ))}
          </ul>
        </aside>

        {/* MAIN */}
        <main className="main">
          <h1>My Dashboard</h1>

          {/* File Upload */}
          <div
            className={`file-upload-bar ${isDragging ? "dragging" : ""}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            <input
              type="file"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <p>{isDragging ? "Drop files here..." : "Drag & drop files or click to upload"}</p>
            <div className="uploaded-badges">
              {uploadedFiles.map((file) => (
                <span key={file.name} className="badge">
                  {file.name}
                  <button onClick={() => handleRemoveFile(file.name)}>✕</button>
                </span>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="error-box">
              ❌ {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="loading-box">
              🤖 Generating query...
            </div>
          )}

          {/* Chart Result */}
          {chartData && renderChart()}

          {/* Empty state */}
          {!chartData && !loading && !error && (
            <div className="canvas">
              <div className="placeholder">
                <p>Ask a question in the sidebar to generate a chart</p>
                <p style={{ fontSize: "13px", color: "#666" }}>
                  e.g. "Total revenue by region" or "Monthly revenue trend"
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
