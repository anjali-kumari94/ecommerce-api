const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");

// Get all payments (transactions)
router.get("/", protect, paymentController.getAllPayments);

module.exports = router;
