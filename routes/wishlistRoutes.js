const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const { protect } = require("../middlewares/authMiddleware");

// Add product to wishlist
router.post("/add", protect, wishlistController.addToWishlist);
// Get user's wishlist
router.get("/", protect, wishlistController.getWishlist);
// Remove product from wishlist
router.delete("/remove", protect, wishlistController.removeFromWishlist);
// Move product from wishlist to cart
router.post("/move-to-cart", protect, wishlistController.moveToCart);

module.exports = router;
