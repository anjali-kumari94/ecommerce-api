const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { protect } = require("../middlewares/authMiddleware");

// Add to cart
router.post("/add", protect, cartController.addToCart);

// Get cart
router.get("/", protect, cartController.getCart);

// Update cart item
router.put("/update", protect, cartController.updateCartItem);

// Remove cart item
router.delete("/remove", protect, cartController.removeCartItem);

// Clear cart
router.delete("/clear", protect, cartController.clearCart);

module.exports = router;
