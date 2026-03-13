import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      {/* Sidebar - Fixed Position for Command Center feel */}
      <aside className="sidebar-wrapper">
        <Sidebar />
      </aside>

      <div className="admin-main">
        {/* Navbar - Sticky with Glass effect */}
        <Navbar />

        {/* Page Content - Wrapped in an animation container */}
        <main className="admin-content">
          <div className="content-container animate-fade">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}