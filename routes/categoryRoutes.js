const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryTree,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategoryAnalytics,
  bulkUpdateCategories,
} = require("../controllers/categoryController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Public routes
router.get("/", getCategories);
router.get("/tree", getCategoryTree);
router.get("/:id", getCategory);

// Protected routes (Admin only)
router.use(protect, authorize("admin"));

router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.get("/:id/analytics", getCategoryAnalytics);
router.put("/bulk/update", bulkUpdateCategories);

module.exports = router;
