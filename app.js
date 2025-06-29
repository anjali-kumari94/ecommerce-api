const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
require("dotenv").config();
require("./models/Category");
require("./models/Brand");

// Check for required environment variables
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    "Missing required environment variables:",
    missingEnvVars.join(", ")
  );
  console.log("\nPlease create a .env file with the following variables:");
  console.log(`
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce_db
JWT_SECRET=your_secret_key_here
    `);
  process.exit(1);
}

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Basic route for testing
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "E-commerce API is running",
    environment: process.env.NODE_ENV,
  });
});

// API Routes
const apiV1 = express.Router();

// Auth Routes
apiV1.use("/auth", require("./routes/authRoutes"));
console.log("Auth routes mounted");

// User Routes
apiV1.use("/users", require("./routes/userRoutes"));
console.log("User routes mounted");

// Product Routes
apiV1.use("/products", require("./routes/productRoutes"));
console.log("Product routes mounted");

// Category Routes
apiV1.use("/categories", require("./routes/categoryRoutes"));
console.log("Category routes mounted");

// Brand Routes
apiV1.use("/brands", require("./routes/brandRoutes"));
console.log("Brand routes mounted");

// Cart Routes
apiV1.use("/cart", require("./routes/cartRoutes"));
console.log("Cart routes mounted");

// Wishlist Routes
apiV1.use("/wishlist", require("./routes/wishlistRoutes"));
console.log("Wishlist routes mounted");

// Shipping Routes
apiV1.use("/shipping", require("./routes/shippingRoutes"));
console.log("Shipping routes mounted");

// Order Routes
apiV1.use("/orders", require("./routes/orderRoutes"));
console.log("Order routes mounted");

// Payment Routes
apiV1.use("/payments", require("./routes/paymentRoutes"));
console.log("Payment routes mounted");

// Review Routes
apiV1.use("/reviews", require("./routes/reviewRoutes"));
console.log("Review routes mounted");

// Mount API routes
app.use("/api/v1", apiV1);
console.log("API v1 routes mounted");

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || "Server Error",
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

// Function to start server
const startServer = async () => {
  try {
    // Start server only if not in test environment
    if (process.env.NODE_ENV !== "test") {
      const server = app.listen(PORT, () => {
        console.log(
          `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
        );
        console.log(`API URL: http://localhost:${PORT}`);
      });

      // Handle server errors
      server.on("error", (error) => {
        if (error.code === "EADDRINUSE") {
          console.error(
            `Port ${PORT} is already in use. Trying port ${PORT + 1}`
          );
          server.close();
          app.listen(PORT + 1, () => {
            console.log(
              `Server is running in ${process.env.NODE_ENV} mode on port ${
                PORT + 1
              }`
            );
            console.log(`API URL: http://localhost:${PORT + 1}`);
          });
        } else {
          console.error("Server error:", error);
          process.exit(1);
        }
      });

      // Handle process termination
      process.on("SIGTERM", () => {
        console.log("SIGTERM received. Shutting down gracefully");
        server.close(() => {
          console.log("Process terminated");
        });
      });
    }
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app; // Export for testing
