import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {

  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="admin-main">

        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="admin-content">
          {children}
        </main>

      </div>

    </div>
  );

}