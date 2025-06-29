const express = require("express");
const router = express.Router();
const shippingController = require("../controllers/shippingController");
const { protect, admin } = require("../middlewares/authMiddleware");

// Public: Get all available shipping methods
router.get("/", shippingController.getShippingMethods);

// Admin: Create, update, delete shipping methods
router.post("/", protect, admin, shippingController.createShippingMethod);
router.put("/:id", protect, admin, shippingController.updateShippingMethod);
router.delete("/:id", protect, admin, shippingController.deleteShippingMethod);

module.exports = router;
