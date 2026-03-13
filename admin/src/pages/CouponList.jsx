import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";
import "./Coupon.css";

export default function CouponList(){

const [coupons,setCoupons] = useState([]);
const [selectedCoupons,setSelectedCoupons] = useState([]);
const [search,setSearch] = useState("");
const [loading,setLoading] = useState(true);
const [deleteId,setDeleteId] = useState(null);
const [sort,setSort] = useState("newest");

const now = new Date();

/* ------------------------------
FETCH COUPONS
------------------------------ */

const fetchCoupons = async ()=>{

try{

setLoading(true);

const {data} = await api.get(`/coupons?search=${search}&sort=${sort}`);

setCoupons(data);

}catch(err){

console.error(err);

}finally{

setLoading(false);

}

};

useEffect(()=>{
fetchCoupons();
},[search,sort]);

/* ------------------------------
SELECT COUPON
------------------------------ */

const toggleSelect = (id)=>{

if(selectedCoupons.includes(id)){

setSelectedCoupons(selectedCoupons.filter(c => c !== id));

}else{

setSelectedCoupons([...selectedCoupons,id]);

}

};

/* ------------------------------
SELECT ALL
------------------------------ */

const toggleSelectAll = ()=>{

if(selectedCoupons.length === coupons.length){

setSelectedCoupons([]);

}else{

setSelectedCoupons(coupons.map(c => c._id));

}

};

/* ------------------------------
BULK DELETE
------------------------------ */

const bulkDelete = async ()=>{

if(selectedCoupons.length === 0) return;

if(!window.confirm("Delete selected coupons?")) return;

await Promise.all(
selectedCoupons.map(id => api.delete(`/coupons/${id}`))
);

setSelectedCoupons([]);

fetchCoupons();

};

/* ------------------------------
DELETE MODAL
------------------------------ */

const confirmDelete = (id)=>{
setDeleteId(id);
};

const deleteCoupon = async ()=>{

await api.delete(`/coupons/${deleteId}`);

setDeleteId(null);

fetchCoupons();

};

/* ------------------------------
STATUS
------------------------------ */
const getStatus=(coupon)=>{

const now=new Date();

if(!coupon.isActive) return "inactive";

if(new Date(coupon.expiryDate)<now) return "expired";

if(coupon.usedCount>=coupon.usageLimit) return "used";

return "active";

};

/* ------------------------------
STATS
------------------------------ */

const totalCoupons = coupons.length;

const activeCoupons = coupons.filter(c =>
new Date(c.expiryDate) > now && c.usedCount < c.usageLimit
).length;

const expiredCoupons = coupons.filter(c =>
new Date(c.expiryDate) <= now
).length;

const usedCoupons = coupons.filter(c =>
c.usedCount >= c.usageLimit
).length;

/* ------------------------------
RENDER
------------------------------ */

return(

<AdminLayout>

{/* HEADER */}

<div className="coupon-header">

<h2>Coupons</h2>

<div className="coupon-header-actions">

<input
className="coupon-search"
placeholder="Search coupon..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<select
className="coupon-sort"
value={sort}
onChange={(e)=>setSort(e.target.value)}
>
<option value="newest">Newest</option>
<option value="expiry">Expiry Date</option>
<option value="usage">Most Used</option>
</select>

<button
className="create-btn"
onClick={()=>window.location.href="/admin/coupons/create"}
>
+ Create Coupon
</button>

</div>

</div>


{/* STATS */}

<div className="coupon-stats">

<div className="stat-card">
<p>Total Coupons</p>
<h3>{totalCoupons}</h3>
</div>

<div className="stat-card">
<p>Active</p>
<h3>{activeCoupons}</h3>
</div>

<div className="stat-card">
<p>Expired</p>
<h3>{expiredCoupons}</h3>
</div>

<div className="stat-card">
<p>Used Up</p>
<h3>{usedCoupons}</h3>
</div>

</div>


{/* BULK ACTIONS */}

{selectedCoupons.length > 0 && (

<div className="bulk-actions">

<div className="bulk-left">
{selectedCoupons.length} selected
</div>

<div className="bulk-right">

<button
className="bulk-delete-btn"
onClick={bulkDelete}
>
Delete Selected
</button>

<button
className="bulk-cancel-btn"
onClick={()=>setSelectedCoupons([])}
>
Cancel
</button>

</div>

</div>

)}


{/* TABLE */}

<div className="coupon-table">

<table>

<thead>

<tr>

<th>

<input
type="checkbox"
checked={selectedCoupons.length === coupons.length && coupons.length > 0}
onChange={toggleSelectAll}
/>

</th>

<th>Code</th>
<th>Type</th>
<th>Value</th>
<th>Usage</th>
<th>Status</th>
<th>Expiry</th>
<th>Actions</th>

</tr>

</thead>


<tbody>

{coupons.length === 0 && !loading && (

<tr>
<td colSpan="8" className="empty-row">
No coupons found
</td>
</tr>

)}

{coupons.map((coupon)=>{

const status = getStatus(coupon);

const percent = (coupon.usedCount / coupon.usageLimit) * 100;
const expiryDays =
Math.ceil(
(new Date(coupon.expiryDate) - new Date()) /
(1000 * 60 * 60 * 24)
);

let barColor="#3b82f6";

if(percent > 70) barColor="#ef4444";
else if(percent > 40) barColor="#f59e0b";

return(

<tr key={coupon._id}>

<td>

<input
type="checkbox"
checked={selectedCoupons.includes(coupon._id)}
onChange={()=>toggleSelect(coupon._id)}
/>

</td>

<td>{coupon.code}</td>

<td>{coupon.discountType}</td>

<td>{coupon.value}</td>

<td>

<div className="usage-wrapper">

<div className="usage-bar">

<div
className="usage-fill"
style={{
width:`${percent}%`,
background:barColor
}}
></div>

</div>
<span className="usage-text">
{coupon.usedCount} / {coupon.usageLimit}
({Math.round(percent)}%)
</span>

</div>

</td>

<td>

<div className="status-wrapper">
<span className={`badge
${status==="active" ? "green" : ""}
${status==="expired" ? "red" : ""}
${status==="used" ? "orange" : ""}
${status==="inactive" ? "gray" : ""}
`}>

{status==="active" && "Active"}
{status==="expired" && "Expired"}
{status==="used" && "Used Up"}
{status==="inactive" && "Inactive"}

</span>

<label className="switch">

<input
type="checkbox"
checked={coupon.isActive}
onChange={async ()=>{

setCoupons(prev =>
prev.map(c =>
c._id===coupon._id
? {...c,isActive:!c.isActive}
: c
)
);

await api.patch(`/coupons/${coupon._id}/toggle`);

}}
/>

<span className="slider"></span>

</label>

</div>

</td>
<td>

<span className={expiryDays < 3 ? "expiry-warning" : ""}>
{new Date(coupon.expiryDate).toLocaleDateString()}
</span>

</td>
<td>

<div className="actions">

<button
className="copy-btn"
onClick={()=>{
navigator.clipboard.writeText(coupon.code);
alert("Coupon code copied");
}}
>
Copy
</button>

<button
className="delete-btn"
onClick={()=>confirmDelete(coupon._id)}
>
Delete
</button>

</div>

</td>

</tr>

);

})}

</tbody>

</table>

</div>


{/* DELETE MODAL */}

{deleteId && (

<div className="modal-overlay">

<div className="delete-modal">

<h3>Delete Coupon</h3>

<p>Are you sure you want to delete this coupon?</p>

<div className="modal-actions">

<button
className="cancel-btn"
onClick={()=>setDeleteId(null)}
>
Cancel
</button>

<button
className="confirm-delete-btn"
onClick={deleteCoupon}
>
Delete
</button>

</div>

</div>

</div>

)}

</AdminLayout>

);

}