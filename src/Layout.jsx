import { Link, Outlet } from "react-router-dom";
import "./App.css";

export default function Layout() {
  return (
    <div className="dashboard">
      <header className="navbar">
        <div className="logo">IntelliDash</div>

        <nav>
          <Link to="/">My Dashboards</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/datasources">Data Sources</Link>
          <Link to="#">Settings</Link>
        </nav>

        <input className="search" placeholder="Search" />
      </header>

      <Outlet />
    </div>
  );
}
