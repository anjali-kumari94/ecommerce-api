const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");

// Create a review
router.post("/", protect, reviewController.createReview);

// Get all reviews for a product
router.get("/product/:productId", reviewController.getReviewsForProduct);

// Get a single review
router.get("/:id", reviewController.getReview);

// Update a review
router.put("/:id", protect, reviewController.updateReview);

// Delete a review
router.delete("/:id", protect, reviewController.deleteReview);

module.exports = router;
