import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./Layout";
import Dashboard from "./dashboard";
import DataSources from "./DataSources";
import Report from "./report";

export default function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  return (
    <Routes>
      {/* Layout wrapper */}
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <Dashboard
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
            />
          }
        />
        <Route
          path="/datasources"
          element={<DataSources uploadedFiles={uploadedFiles} />}
        />
        <Route path="/reports" element={<Report />} />
      </Route>
    </Routes>
  );
}
