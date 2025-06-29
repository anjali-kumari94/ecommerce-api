const Review = require("../models/Review");
const Product = require("../models/Product");

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    if (!product || !rating) {
      return res
        .status(400)
        .json({ success: false, error: "Product and rating are required." });
    }
    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found." });
    }
    // Prevent duplicate review by same user for same product
    const existing = await Review.findOne({ product, user: req.user._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "You have already reviewed this product.",
      });
    }
    const review = new Review({
      user: req.user._id,
      product,
      rating,
      comment,
    });
    await review.save();
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all reviews for a product
exports.getReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId, isActive: true })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a single review by ID
exports.getReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id).populate("user", "name email");
    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found." });
    }
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found." });
    }
    // Only author or admin can update
    if (
      review.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ success: false, error: "Not authorized." });
    }
    const { rating, comment, isActive } = req.body;
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    if (isActive !== undefined) review.isActive = isActive;
    await review.save();
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found." });
    }
    // Only author or admin can delete
    if (
      review.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ success: false, error: "Not authorized." });
    }
    await review.deleteOne();
    res.json({ success: true, message: "Review deleted." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
