const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updatePassword,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);

module.exports = router;
