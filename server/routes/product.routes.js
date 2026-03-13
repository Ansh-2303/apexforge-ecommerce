const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const validate = require("../middleware/validate.middleware")
const { createProductSchema } = require("../validation/product.validation")
const {
  createProduct,
  getProducts,
  getProductBySlug,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductPerformance,
getInventoryAnalytics,
createProductReview
} = require("../controllers/product.controller");

const { protect, admin } = require("../middleware/auth.middleware");

router.get("/", getProducts);
router.get("/admin/performance", protect, admin, getProductPerformance);
router.get("/admin/inventory", protect, admin, getInventoryAnalytics);

router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  validate(createProductSchema),
  createProduct
);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.post(
  "/:id/reviews",
  protect,
  createProductReview
)

module.exports = router;