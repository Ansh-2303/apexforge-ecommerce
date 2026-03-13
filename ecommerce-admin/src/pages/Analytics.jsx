import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";
import "./Analytics.css";

import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid,
BarChart,
Bar,
PieChart,
Pie,
Cell,
Legend
} from "recharts";

const COLORS = ["#3b82f6","#22c55e","#f59e0b","#ef4444"];

/* ---------------- COMPONENT ---------------- */

const Analytics = () => {

const [analytics,setAnalytics] = useState({})
const [categoryData,setCategoryData] = useState([])
const [customerGrowth,setCustomerGrowth] = useState([])


/* -------- FETCH MAIN ANALYTICS -------- */

useEffect(()=>{

const fetchAnalytics = async () => {

try{

const {data} = await api.get("/admin/analytics")

setAnalytics(data)

}catch(err){
console.error("Analytics error:",err)
}

}

fetchAnalytics()

},[])


/* -------- FETCH CATEGORY DATA -------- */

useEffect(()=>{

const fetchCategoryData = async () => {

try{

const res = await api.get("/admin/revenue-by-category")

const formatted = res.data.map(c=>({
name:c._id,
value:c.revenue
}))

setCategoryData(formatted)

}catch(err){
console.error(err)
}

}

fetchCategoryData()

},[])


/* -------- FETCH CUSTOMER GROWTH -------- */

useEffect(()=>{

const fetchCustomers = async ()=>{

try{

const res = await api.get("/admin/analytics/customer-growth")

const formatted = res.data.map(c=>({
day:c._id,
customers:c.customers
}))

setCustomerGrowth(formatted)

}catch(err){
console.error(err)
}

}

fetchCustomers()

},[])


/* -------- KPI DATA -------- */

const kpis = analytics


return (

<AdminLayout>

<div className="analytics-page">

<h2>Analytics</h2>
<p>Store performance insights</p>


{/* -------- KPI CARDS -------- */}

<div className="kpi-grid">

<div className="kpi-card">
<p>Total Revenue</p>
<h3>₹{Number(kpis.revenue || 0).toFixed(2)}</h3>
</div>

<div className="kpi-card">
<p>Total Orders</p>
<h3>{kpis.orders || 0}</h3>
</div>

<div className="kpi-card">
<p>Total Customers</p>
<h3>{kpis.customers || 0}</h3>
</div>

<div className="kpi-card">
<p>Avg Order Value</p>
<h3>₹{Number(kpis.avgOrder || 0).toFixed(2)}</h3>
</div>

</div>


{/* -------- REVENUE CHART -------- */}

<div className="chart-card">

<h3>Revenue Over Time</h3>

<ResponsiveContainer width="100%" height={300}>

<LineChart data={analytics.revenuePerDay || []}>

<CartesianGrid strokeDasharray="3 3" />

<XAxis dataKey="_id" />

<YAxis />

<Tooltip />

<Line
type="monotone"
dataKey="revenue"
stroke="#3b82f6"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>


{/* -------- ORDERS + CATEGORY -------- */}

<div className="analytics-grid">

<div className="chart-card">

<h3>Orders Trend</h3>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={analytics.ordersPerDay || []}>

<CartesianGrid strokeDasharray="3 3" />

<XAxis dataKey="_id" />

<YAxis />

<Tooltip />

<Bar dataKey="orders" fill="#22c55e" />

</BarChart>

</ResponsiveContainer>

</div>


<div className="chart-card">

<h3>Sales by Category</h3>

<ResponsiveContainer width="100%" height={300}>

<PieChart>

<Pie
data={categoryData}
dataKey="value"
nameKey="name"
outerRadius={100}
>

{categoryData.map((entry,index)=>(
<Cell
key={index}
fill={COLORS[index % COLORS.length]}
/>
))}

</Pie>

<Tooltip />
<Legend />

</PieChart>

</ResponsiveContainer>

</div>

</div>


{/* -------- TOP PRODUCTS + CUSTOMER GROWTH -------- */}

<div className="analytics-grid">

<div className="chart-card">

<h3>Top Selling Products</h3>

<div className="top-products">

{(analytics.topProducts || []).map((product,index)=>(

<div key={index} className="product-row">
<span>{product.name}</span>
<div className="product-bar">

<div
className="product-fill"
style={{width:`${product.sales}%`}}
></div>

</div>

<span>{product.sales} sales</span>

</div>

))}

</div>

</div>


<div className="chart-card">

<h3>Customer Growth</h3>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={customerGrowth}>

<CartesianGrid strokeDasharray="3 3" />

<XAxis dataKey="day" />

<YAxis />

<Tooltip />

<Bar dataKey="customers" fill="#3b82f6" />

</BarChart>

</ResponsiveContainer>

</div>

</div>


</div>

</AdminLayout>

);

}

export default Analytics