const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection errors after initial connection
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    // Handle process termination
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    console.log("\nPlease follow these steps to fix the connection:");
    console.log(
      "1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas"
    );
    console.log("2. Create a new cluster");
    console.log('3. Click "Connect" on your cluster');
    console.log('4. Choose "Connect your application"');
    console.log("5. Copy the connection string");
    console.log("6. Replace <password> with your database user password");
    console.log("7. Update your .env file with the new MONGODB_URI");
    process.exit(1);
  }
};

module.exports = connectDB;
