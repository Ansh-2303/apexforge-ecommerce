import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";
import { 
  TrendingUp, Users, ShoppingCart, Package, 
  AlertTriangle, CreditCard, ChevronRight 
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, 
  CartesianGrid, BarChart, Bar, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0, totalOrders: 0, totalUsers: 0, totalProducts: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [inventory, setInventory] = useState({ totalStock: 0, lowStock: [], outOfStock: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, salesRes, statusRes, recentRes, productsRes, inventoryRes] = await Promise.all([
          api.get("/orders/admin/stats"),
          api.get("/orders/admin/sales"),
          api.get("/orders/admin/order-status"),
          api.get("/orders/admin/recent-orders"),
          api.get("/products"),
          api.get("/products/admin/inventory")
        ]);

        setStats(statsRes.data);
        setSalesData(salesRes.data.map(s => ({ name: s._id, revenue: s.revenue })));
        setOrderStatusData(statusRes.data.map(s => ({ name: s._id, value: s.count })));
        setRecentOrders(recentRes.data);
        setInventory(inventoryRes.data);
        
        const top = [...(productsRes.data.products || [])]
          .sort((a, b) => (b.sold || 0) - (a.sold || 0))
          .slice(0, 5);
        setTopProducts(top);

      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <AdminLayout><div className="loading-state">Initializing Command Center...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="dashboard-header">
        <div>
          <h1>Command Center</h1>
          <p>Real-time system overview and performance metrics.</p>
        </div>
        <div className="system-status">
          <span className="pulse-dot"></span> System Live
        </div>
      </div>

      {/* Primary Stats */}
      <div className="stats-grid">
        <StatCard label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={<TrendingUp size={20}/>} trend="+12.5%" />
        <StatCard label="Total Orders" value={stats.totalOrders} icon={<ShoppingCart size={20}/>} trend="+5.2%" />
        <StatCard label="Total Customers" value={stats.totalUsers} icon={<Users size={20}/>} trend="+2.4%" />
        <StatCard label="Active Inventory" value={inventory.totalStock} icon={<Package size={20}/>} />
      </div>

      <div className="main-dashboard-grid">
        {/* Revenue Chart */}
        <div className="chart-container wide">
          <div className="card-header">
            <h3>Revenue Analytics</h3>
            <CreditCard size={18} className="text-dim" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#040914', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#22C55E' }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#22C55E" strokeWidth={3} dot={{ r: 4, fill: '#22C55E' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="chart-container">
          <div className="card-header">
            <h3>Top Performing Gear</h3>
            <TrendingUp size={18} className="text-dim" />
          </div>
          <div className="insight-list">
            {topProducts.map((p) => (
              <div key={p._id} className="insight-item">
                <span className="item-name">{p.name}</span>
                <span className="item-value text-neon">{p.sold || 0} Sold</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="chart-container wide">
          <div className="card-header">
            <h3>Recent Transactions</h3>
            <button className="text-btn">View All <ChevronRight size={14}/></button>
          </div>
          <div className="table-responsive">
            <table className="lux-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.slice(0, 6).map(order => (
                  <tr key={order._id}>
                    <td className="text-dim">#{order._id.slice(-6)}</td>
                    <td>{order.user?.name || "Guest"}</td>
                    <td className="fw-bold">₹{order.totalPrice}</td>
                    <td><span className={`badge-lux ${order.status}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="chart-container">
          <div className="card-header">
            <h3>System Alerts</h3>
            <AlertTriangle size={18} className="text-red" />
          </div>
          <div className="insight-list">
            {inventory.lowStock.length === 0 && <p className="text-dim p-4">All systems nominal.</p>}
            {inventory.lowStock.map((item, i) => (
              <div key={i} className="insight-item alert">
                <span>{item.product}</span>
                <span className="badge-red">{item.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ label, value, icon, trend }) {
  return (
    <div className="lux-stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <p className="stat-label">{label}</p>
        <h3>{value}</h3>
        {trend && <span className="stat-trend">{trend}</span>}
      </div>
    </div>
  );
}