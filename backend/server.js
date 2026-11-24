
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = require("./config/db");

// Import all Mongoose models
const User = require("./models/User");
const Question = require("./models/Question");
const Attempt = require("./models/Attempt");

// Import routes
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);

// API Routes
app.use("/api/health", healthRoutes);

// Initialize MongoDB collections
const initializeCollections = async () => {
  const models = [User, Question, Attempt];

  for (const model of models) {
    const collectionName = model.collection.collectionName;

    const exists = await mongoose.connection.db
      .listCollections(
        { name: collectionName },
        { nameOnly: true }
      )
      .hasNext();

    if (!exists) {
      await mongoose.connection.db.createCollection(
        collectionName
      );

      console.log(`Collection created: ${collectionName}`);
    } else {
      console.log(`Collection already exists: ${collectionName}`);
    }
  }

  // Initialize model indexes
  await Promise.all(models.map((model) => model.init()));

  console.log("All models initialized successfully");
};

// Start server
const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Initialize all collections
    await initializeCollections();

    // 3. Start Express server
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
