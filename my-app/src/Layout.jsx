import { NavLink, Outlet } from "react-router-dom";
import "./App.css";

export default function Layout() {
  return (
    <div className="dashboard">
      <header className="navbar">
        <div className="logo">IntelliDash</div>

        <nav>
          <NavLink to="/">My Dashboards</NavLink>
          <NavLink to="/reports">Reports</NavLink>
          <NavLink to="/datasources">Data Sources</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>

        <input className="search" placeholder="Search" />
      </header>

      <Outlet />
    </div>
  );
}
