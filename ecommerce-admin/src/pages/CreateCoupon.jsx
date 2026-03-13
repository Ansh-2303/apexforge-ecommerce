import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";
import "./Coupon.css";

export default function CreateCoupon() {

const [form, setForm] = useState({
code:"",
discountType:"percentage",
value:"",
expiryDate:"",
usageLimit:1
});

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const handleSubmit=async(e)=>{
e.preventDefault();

try{

await api.post("/coupons",{
code:form.code.toUpperCase(),
discountType:form.discountType,
value:Number(form.value),
expiryDate:form.expiryDate,
usageLimit:Number(form.usageLimit)
});

alert("Coupon created successfully");

setForm({
code:"",
discountType:"percentage",
value:"",
expiryDate:"",
usageLimit:1
});

}catch(error){
alert(error.response?.data?.message || "Error creating coupon");
}
};

return(

<AdminLayout>

<div className="coupon-header">
<h2>Create Coupon</h2>
</div>

<div className="coupon-form-card">

<h3 className="coupon-form-title">Coupon Details</h3>

<form onSubmit={handleSubmit} className="coupon-form">

<div className="form-group">
<label>Coupon Code</label>
<input
name="code"
placeholder="SUMMER20"
value={form.code}
onChange={handleChange}
required
/>
</div>

<div className="form-row">

<div className="form-group">
<label>Discount Type</label>
<select
name="discountType"
value={form.discountType}
onChange={handleChange}
>
<option value="percentage">Percentage</option>
<option value="fixed">Fixed Amount</option>
</select>
</div>

<div className="form-group">
<label>Discount Value</label>
<input
name="value"
type="number"
placeholder="10"
value={form.value}
onChange={handleChange}
required
/>
</div>

</div>

<div className="form-row">

<div className="form-group">
<label>Expiry Date</label>
<input
name="expiryDate"
type="date"
value={form.expiryDate}
onChange={handleChange}
required
/>
</div>

<div className="form-group">
<label>Usage Limit</label>
<input
name="usageLimit"
type="number"
value={form.usageLimit}
onChange={handleChange}
/>
</div>

</div>

<div className="form-actions">

<button
type="button"
className="cancel-btn"
onClick={()=>window.history.back()}
>
Cancel
</button>

<button
className="coupon-btn"
type="submit"
>
Create Coupon
</button>

</div>

</form>

</div>

</AdminLayout>
);
}