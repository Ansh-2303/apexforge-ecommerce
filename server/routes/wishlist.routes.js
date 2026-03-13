const express = require("express")
const router = express.Router()

const { protect } = require("../middleware/auth.middleware")

const {
  toggleWishlist,
  getWishlist
} = require("../controllers/wishlist.controller")

router.get("/", protect, getWishlist)

router.post("/:productId", protect, toggleWishlist)

module.exports = router