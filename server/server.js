require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const addressRoutes = require("./routes/address.routes");
const userRoutes = require("./routes/user.routes");

const errorHandler = require("./middleware/error.middleware")

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Ecommerce API Running 🚀");
});

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/coupons", require("./routes/coupon.routes"));
app.use("/api/addresses", addressRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);
app.use("/api/admin", require("./routes/analytics.routes"))


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const apiLimiter = require("./middleware/rateLimit.middleware")
app.use("/api", apiLimiter)

app.use(errorHandler)

const wishlistRoutes = require("./routes/wishlist.routes")

app.use("/api/wishlist", wishlistRoutes)
