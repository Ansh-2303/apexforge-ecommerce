const express = require("express");
const router = express.Router();
const {
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/address.controller");

const { protect } = require("../middleware/auth.middleware");

// All routes require login
router.get("/", protect, getAddresses);
router.post("/", protect, addAddress);
router.delete("/:addressId", protect, deleteAddress);
router.put("/default/:addressId", protect, setDefaultAddress);

module.exports = router;