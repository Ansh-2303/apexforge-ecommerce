import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import "./Dashboard.css";

export default function Dashboard() {

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0
  });

  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [productPerformance, setProductPerformance] = useState([]);
  const [inventory, setInventory] = useState({
  totalStock: 0,
  lowStock: [],
  outOfStock: []
});
const [topCustomers, setTopCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchStats = async () => {
      try {

        const { data } = await api.get("/orders/admin/stats");
        setStats(data);

        const { data: products } = await api.get("/products");
        const productList = products.products || [];

        const top = [...productList]
          .sort((a, b) => (b.sold || 0) - (a.sold || 0))
          .slice(0, 5);

        const low = productList.filter(p => (p.stock || 0) <= 5);

        setTopProducts(top);
        setLowStockProducts(low);

        const { data: sales } = await api.get("/orders/admin/sales");

        const formattedSales = sales.map(s => ({
          name: s._id,
          revenue: s.revenue,
          orders: s.orders
        }));

        setSalesData(formattedSales);

        const { data: statusStats } = await api.get("/orders/admin/order-status");

        const formattedStatus = statusStats.map(s => ({
          name: s._id,
          value: s.count
        }));

        setOrderStatusData(formattedStatus);

        const { data: recent } = await api.get("/orders/admin/recent-orders");
        setRecentOrders(recent);

        const { data: category } = await api.get("/orders/admin/category-revenue");

        const formattedCategory = category.map(c => ({
          name: c._id,
          revenue: c.revenue
        }));

        setCategoryRevenue(formattedCategory);

        const { data: performance } = await api.get("/products/admin/performance");

        const formattedPerformance = performance.map(p => ({
          name: p.name,
          unitsSold: p.unitsSold,
          revenue: p.revenue
        }));

        setProductPerformance(formattedPerformance);
        // Inventory Analytics
const { data: inventoryData } = await api.get("/products/admin/inventory");
setInventory(inventoryData);

// Customer Analytics
const { data: customers } = await api.get("/orders/admin/top-customers");

setTopCustomers(customers);

      } catch (error) {
        console.error("Dashboard error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

  }, []);

  const chartOrdersData = [
    { name: "Orders", value: stats.totalOrders }
  ];

  return (

    <AdminLayout>

      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Business analytics and store performance</p>
      </div>

      {/* Stats Cards */}

      <div className="stats-grid">

        <div className="stat-card">
          <span className="stat-label">Total Revenue</span>
          <h3>₹{stats.totalRevenue.toFixed(2)}</h3>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total Orders</span>
          <h3>{stats.totalOrders}</h3>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total Customers</span>
          <h3>{stats.totalUsers}</h3>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total Products</span>
          <h3>{stats.totalProducts}</h3>
        </div>

      </div>

      {/* Charts */}

      <div className="charts-grid">

        <div className="chart-card">
          <h4>Revenue Overview</h4>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#4f8cff"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

        <div className="chart-card">
          <h4>Orders Overview</h4>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartOrdersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>

        </div>

        <div className="chart-card">
          <h4>Order Status Distribution</h4>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>

              <Pie
                data={orderStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {orderStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#f59e0b","#3b82f6","#10b981","#6366f1","#ef4444"][index % 5]}
                  />
                ))}
              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>

        </div>

        <div className="chart-card">
          <h4>Revenue by Category</h4>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#6366f1" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* Insights */}

      <div className="dashboard-insights">

        <div className="insight-card">

          <h3>Top Selling Products</h3>

          {topProducts.length === 0 && (
            <p className="insight-empty">No sales data yet</p>
          )}

          {topProducts.map(product => (
            <div key={product._id} className="insight-row">
              <span>{product.name}</span>
              <span>Sold data coming soon</span>
            </div>
          ))}

        </div>

        <div className="insight-card">

          <h3>Low Stock Alerts</h3>

          {lowStockProducts.length === 0 && (
            <p className="insight-empty">Stock levels are healthy</p>
          )}

          {lowStockProducts.map(product => (
            <div key={product._id} className="insight-row">
              <span>{product.name}</span>
              <span className="low-stock">{product.stock}</span>
            </div>
          ))}

        </div>

      </div>

      {/* Recent Orders */}

      <div className="recent-orders-card">

        <h3>Recent Orders</h3>

        {recentOrders.length === 0 && (
          <p className="insight-empty">No recent orders</p>
        )}

        {recentOrders.map(order => (

          <div key={order._id} className="recent-order-row">

            <div>
              <strong>#{order._id.slice(-6)}</strong>
            </div>

            <div>
              {order.user?.name || "Customer"}
            </div>

            <div>
              ₹{order.totalPrice}
            </div>

            <div className={`status ${order.status}`}>
              {order.status}
            </div>

            <div>
              {new Date(order.createdAt).toLocaleDateString()}
            </div>

          </div>

        ))}

      </div>

      {/* Product Performance */}

      <div className="product-performance-section">

        <div className="chart-card">

          <h4>Best Selling Products</h4>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="unitsSold" fill="#f59e0b" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>

        </div>


        <div className="chart-card">

          <h4>Product Revenue Performance</h4>

          <table className="product-performance-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>

            <tbody>

              {productPerformance.map((p, index) => (

                <tr key={index}>
                  <td>{p.name}</td>
                  <td>{p.unitsSold}</td>
                  <td>₹{p.revenue}</td>
                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
      {/* Inventory Intelligence */}

<div className="inventory-section">

  <div className="stat-card">
    <span className="stat-label">Total Inventory Units</span>
    <h3>{inventory.totalStock}</h3>
  </div>

  <div className="chart-card">

    <h4>Low Stock Variants</h4>

    {inventory.lowStock.map((item, index) => (
      <div key={index} className="insight-row">
        <span>{item.product}</span>
        <span className="low-stock">{item.stock}</span>
      </div>
    ))}

  </div>

  <div className="chart-card">

    <h4>Out Of Stock</h4>

    {inventory.outOfStock.map((item, index) => (
      <div key={index} className="insight-row">
        <span>{item.product}</span>
        <span className="low-stock">0</span>
      </div>
    ))}

  </div>

</div>
{/* Top Customers */}

<div className="top-customers-section">

  <div className="chart-card">

    <h4>Top Customers</h4>

    {topCustomers.map((customer, index) => (

      <div key={index} className="insight-row">

        <span>{customer.name}</span>

        <span>
          {customer.totalOrders} orders • ₹{customer.totalSpent}
        </span>

      </div>

    ))}

  </div>

</div>

    </AdminLayout>

  );
}