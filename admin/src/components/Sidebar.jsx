import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, ShoppingBag, Layers, 
  BarChart3, Ticket, User, Settings, PlusCircle 
} from "lucide-react";
import "./AdminLayout.css";

export default function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Products", path: "/admin/products", icon: <ShoppingBag size={18} /> },
    { name: "Categories", path: "/admin/categories", icon: <Layers size={18} /> },
    { name: "Orders", path: "/admin/orders", icon: <BarChart3 size={18} /> },
    { name: "Coupons", path: "/admin/coupons", icon: <Ticket size={18} /> },
    { name: "Create Coupon", path: "/admin/coupons/create", icon: <PlusCircle size={18} /> },
    { name: "Customers", path: "/admin/customers", icon: <User size={18} /> },
    { name: "Analytics", path: "/admin/analytics", icon: <BarChart3 size={18} /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={18} /> }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-accent">APEX</span>FORGE
      </div>

      <nav className="sidebar-nav">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-link ${isActive ? "active-link" : ""}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <p>© 2026 ApexForge v1.0</p>
      </div>
    </aside>
  );
}