const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require("../controllers/category.controller");

const { protect, admin } = require("../middleware/auth.middleware");

router.post("/", protect, admin, createCategory);
router.get("/", getCategories);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;