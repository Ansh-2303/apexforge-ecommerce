const express = require("express");
const router = express.Router();
const {
  createCoupon,
  validateCoupon,
  getAllCoupons,  
  deleteCoupon   
} = require("../controllers/coupon.controller");

const { protect, admin } = require("../middleware/auth.middleware");
const { toggleCoupon } = require("../controllers/coupon.controller");

// Admin creates coupon
router.post("/", protect, admin, createCoupon);

// User validates coupon
router.post("/validate", protect, validateCoupon);

router.get("/", protect, admin, getAllCoupons);
router.delete("/:id", protect, admin, deleteCoupon);
router.patch("/:id/toggle", protect, admin, toggleCoupon);

module.exports = router;