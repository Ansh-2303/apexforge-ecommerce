const express = require("express");
const router = express.Router();
const { getOrderStatusAnalytics } = require("../controllers/order.controller");
const { getRecentOrders } = require("../controllers/order.controller");
const { getRevenueByCategory } = require("../controllers/order.controller");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getAdminStats,
  payOrder,
  markOrderAsShipped,
  markOrderAsDelivered,
  getSalesAnalytics,
  getCustomerAnalytics
} = require("../controllers/order.controller");

const { protect, admin } = require("../middleware/auth.middleware");

// User routes
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.post("/:id/pay", protect, payOrder);
router.get("/:id", protect, getOrderById);

// Admin routes
router.get("/", protect, admin, getAllOrders);
router.put("/:id", protect, admin, updateOrderStatus);


router.get("/admin/stats", protect, admin, getAdminStats);
router.get("/admin/sales", protect, admin, getSalesAnalytics);
router.get("/admin/top-customers", protect, admin, getCustomerAnalytics);
router.get("/admin/order-status", protect, admin, getOrderStatusAnalytics);
router.get("/admin/recent-orders", protect, admin, getRecentOrders);
router.get("/admin/category-revenue", protect, admin, getRevenueByCategory);

// Shipment routes
router.put("/:id/ship", protect, admin, markOrderAsShipped);
router.put("/:id/deliver", protect, admin, markOrderAsDelivered);

module.exports = router;