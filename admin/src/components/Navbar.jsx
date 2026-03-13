import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Search } from "lucide-react";
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
      <div className="navbar-left">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Command Search..." />
        </div>
      </div>

      <div className="navbar-right">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="admin-profile">
          <div className="admin-info">
            <span className="admin-name">{adminName || "Administrator"}</span>
            <span className="admin-role">Super Admin</span>
          </div>
          <button className="logout-minimal" onClick={logoutHandler} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}