const express = require("express");
const router = express.Router();
const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  getBrandAnalytics,
  getTopPerformingBrands,
  searchBrands,
  bulkUpdateBrands,
} = require("../controllers/brandController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Public routes
router.get("/", getBrands);
router.get("/top-performing", getTopPerformingBrands);
router.get("/search", searchBrands);
router.get("/:id", getBrand);

// Protected routes (Admin only)
router.use(protect, authorize("admin"));

router.post("/", createBrand);
router.put("/:id", updateBrand);
router.delete("/:id", deleteBrand);
router.get("/:id/analytics", getBrandAnalytics);
router.put("/bulk/update", bulkUpdateBrands);

module.exports = router;
