const Order = require("../models/order.model")
const User = require("../models/user.model")

/* ---------------- MAIN ANALYTICS ---------------- */

exports.getAnalytics = async (req, res) => {
try{

/* KPI DATA */

const totalRevenue = await Order.aggregate([
{
$match:{ isPaid:true, status:{ $ne:"cancelled" } }
},
{
$group:{
_id:null,
revenue:{ $sum:"$totalPrice" }
}
}
])

const orders = await Order.countDocuments({
status:{ $ne:"cancelled" }
})

const customers = await User.countDocuments({
role:"user"
})

const revenue = totalRevenue[0]?.revenue || 0
const avgOrder = orders ? revenue / orders : 0


/* REVENUE PER DAY */

const revenuePerDay = await Order.aggregate([
{
$match:{ isPaid:true, status:{ $ne:"cancelled" } }
},
{
$group:{
_id:{
$dateToString:{ format:"%Y-%m-%d", date:"$createdAt" }
},
revenue:{ $sum:"$totalPrice" }
}
},
{ $sort:{ _id:1 } }
])


/* ORDERS PER DAY */

const ordersPerDay = await Order.aggregate([
{
$group:{
_id:{
$dateToString:{ format:"%Y-%m-%d", date:"$createdAt" }
},
orders:{ $sum:1 }
}
},
{ $sort:{ _id:1 } }
])


/* TOP PRODUCTS */

const topProducts = await Order.aggregate([
{
$match:{
isPaid:true,
status:{ $ne:"cancelled" }
}
},
{ $unwind:"$orderItems" },
{
$group:{
_id:"$orderItems.product",
sales:{ $sum:"$orderItems.quantity" }
}
},
{
$lookup:{
from:"products",
localField:"_id",
foreignField:"_id",
as:"product"
}
},
{ $unwind:"$product" },
{
$project:{
name:"$product.name",
sales:1
}
},
{ $sort:{ sales:-1 } },
{ $limit:5 }
])


/* SALES BY CATEGORY */

const salesByCategory = await Order.aggregate([
{
$match:{
isPaid:true,
status:{ $ne:"cancelled" }
}
},
{ $unwind:"$orderItems" },
{
$lookup:{
from:"products",
localField:"orderItems.product",
foreignField:"_id",
as:"product"
}
},
{ $unwind:"$product" },
{
$lookup:{
from:"categories",
localField:"product.category",
foreignField:"_id",
as:"category"
}
},
{ $unwind:"$category" },
{
$group:{
_id:"$category.name",
sales:{ $sum:"$orderItems.quantity" }
}
},
{
$project:{
category:"$_id",
sales:1,
_id:0
}
},
{ $sort:{ sales:-1 } }
])


res.json({
revenue,
orders,
customers,
avgOrder,
revenuePerDay,
ordersPerDay,
topProducts,
salesByCategory
})

}catch(err){
res.status(500).json({ message:err.message })
}
}


/* ---------------- CUSTOMER GROWTH ---------------- */

exports.getCustomerGrowth = async (req,res)=>{
try{

const data = await User.aggregate([
{
$match:{ role:"user" }
},
{
$group:{
_id:{
$dateToString:{ format:"%Y-%m-%d", date:"$createdAt" }
},
customers:{ $sum:1 }
}
},
{ $sort:{ _id:1 } }
])

res.json(data)

}catch(err){
res.status(500).json({ message:err.message })
}
}


/* ---------------- REVENUE BY CATEGORY ---------------- */

exports.getRevenueByCategory = async (req,res)=>{
try{

const data = await Order.aggregate([
{
$match:{
isPaid:true,
status:{ $ne:"cancelled" }
}
},
{ $unwind:"$orderItems" },
{
$lookup:{
from:"products",
localField:"orderItems.product",
foreignField:"_id",
as:"product"
}
},
{ $unwind:"$product" },
{
$lookup:{
from:"categories",
localField:"product.category",
foreignField:"_id",
as:"category"
}
},
{ $unwind:"$category" },
{
$group:{
_id:"$category.name",
revenue:{
$sum:{
$multiply:[
"$orderItems.price",
"$orderItems.quantity"
]
}
}
}
},
{ $sort:{ revenue:-1 } }
])

res.json(data)

}catch(err){
res.status(500).json({ message:err.message })
}
}