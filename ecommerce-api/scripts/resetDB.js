const mongoose = require("mongoose")
require("dotenv").config()

const Product = require("../models/product.model")
const Category = require("../models/category.model")
const Order = require("../models/order.model")
const Cart = require("../models/cart.model")
const Coupon = require("../models/coupon.model")

const resetDB = async () => {

try {

await mongoose.connect(process.env.MONGO_URI)

console.log("DB connected")

await Product.deleteMany({})
await Category.deleteMany({})
await Order.deleteMany({})
await Cart.deleteMany({})
await Coupon.deleteMany({})

console.log("Store data cleared")

process.exit()

} catch (err) {

console.error(err)
process.exit(1)

}

}

resetDB()