import { useNavigate } from "react-router-dom";
import "./AdminLayout.css";

export default function Navbar() {
  const navigate = useNavigate();
  const adminName = localStorage.getItem("adminName");

  const logoutHandler = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate("/admin/login");
  };

  return (
    <header className="navbar">

      {/* Left Section (future search / page title) */}
      <div className="navbar-left">
        <span className="navbar-title">Admin Dashboard</span>
      </div>

      {/* Right Section */}
      <div className="navbar-right">

        {/* Future notification icon */}
        <span className="nav-icon">🔔</span>

        {/* Admin name */}
        <span className="admin-name">
          👋 {adminName || "Admin"}
        </span>

        {/* Logout */}
        <button className="logout-btn" onClick={logoutHandler}>
          Logout
        </button>

      </div>

    </header>
  );
}