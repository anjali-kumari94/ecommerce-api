const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");

// Place a new order
router.post("/", protect, orderController.placeOrder);

module.exports = router;
