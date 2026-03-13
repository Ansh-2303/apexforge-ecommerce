const express = require("express");
const router = express.Router();

const User = require("../models/user.model");
const { protect, admin } = require("../middleware/auth.middleware");

// GET ALL CUSTOMERS
router.get("/customers", protect, admin, async (req, res) => {
  try {

    const users = await User.find({ role: "user" }).select("-password");

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;