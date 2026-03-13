import { NavLink } from "react-router-dom";
import "./AdminLayout.css";

export default function Sidebar() {

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Products", path: "/admin/products" },
    { name: "Categories", path: "/admin/categories" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Coupons", path: "/admin/coupons" },
    { name: "Create Coupon", path: "/admin/coupons/create" },

    /* Future features */
    { name: "Customers", path: "/admin/customers" },
    { name: "Analytics", path: "/admin/analytics" },
    { name: "Settings", path: "/admin/settings" }
  ];

  return (
    <aside className="sidebar">

      <h2 className="logo">MyStore Admin</h2>

      <nav>

        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            {item.name}
          </NavLink>
        ))}

      </nav>

    </aside>
  );
}