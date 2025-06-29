const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Create a product (admin only, with image upload)
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.array("images", 5),
  createProduct
);

// Get all products (public)
router.get("/", getProducts);

// Get a single product by ID (public)
router.get("/:id", getProductById);

// Update a product (admin only, with image upload)
router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.array("images", 5),
  updateProduct
);

// Delete a product (admin only)
router.delete("/:id", protect, authorize("admin"), deleteProduct);

module.exports = router;
