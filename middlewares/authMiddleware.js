const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;
    console.log("\n=== Authentication Debug ===");
    console.log("Request headers:", req.headers);
    console.log("Authorization header:", req.headers.authorization);

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      console.log("Token extracted:", token ? "Token exists" : "No token");
    } else {
      console.log("No Bearer token found in Authorization header");
    }

    // Check if token exists
    if (!token) {
      console.log("No token found in request");
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this route",
      });
    }

    try {
      // Verify token
      console.log("\nAttempting to verify token...");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded successfully. User ID:", decoded.id);

      // Get user from the token
      console.log("\nFinding user in database...");
      req.user = await User.findById(decoded.id);
      console.log("User found:", req.user ? "Yes" : "No");

      if (!req.user) {
        console.log("User not found in database");
        return res.status(401).json({
          success: false,
          error: "User not found",
        });
      }

      console.log("Authentication successful!");
      console.log("=== End Authentication Debug ===\n");
      next();
    } catch (error) {
      console.log("\nToken verification failed!");
      console.log("Error message:", error.message);
      console.log("=== End Authentication Debug ===\n");
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this route",
      });
    }
  } catch (error) {
    console.log("\nMiddleware error!");
    console.log("Error message:", error.message);
    console.log("=== End Authentication Debug ===\n");
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

exports.admin = exports.authorize("admin");
