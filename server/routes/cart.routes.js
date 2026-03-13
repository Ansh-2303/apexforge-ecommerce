
const cartController = require("../controllers/cart.controller");
console.log(cartController);

const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cart.controller");

const { protect } = require("../middleware/auth.middleware");

// Get Cart
router.get("/", protect, getCart);

// Add to Cart
router.post("/", protect, addToCart);

// Update Quantity
router.put("/", protect, updateCartItem);

// Remove Item
router.delete("/", protect, removeCartItem);

module.exports = router;