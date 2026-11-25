
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = require("./config/db");

// Models
const User = require("./models/User");
const Question = require("./models/Question");
const Attempt = require("./models/Attempt");

// Routes
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const examRoutes = require("./routes/examRoutes");
const answerRoutes = require("./routes/answerRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const historyRoutes = require("./routes/historyRoutes");

// Scheduler
const startAutoSubmitScheduler =
  require("./utils/autoSubmitScheduler");

const app = express();

// ==================================
// 1. CORS MIDDLEWARE - MUST BE FIRST
// ==================================


// ==================================
// CORS CONFIGURATION
// ==================================

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174"
]
  .filter(Boolean)
  .map((url) => url.trim().replace(/\/$/, ""));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header
    // (such as server-to-server requests)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/$/, "");

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    console.log("Blocked CORS origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// ==================================
// 2. BODY PARSER
// ==================================

app.use(express.json());

// ==================================
// 3. API ROUTES
// ==================================

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/history", historyRoutes);

// ==================================
// 4. INITIALIZE MONGODB COLLECTIONS
// ==================================

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

  await Promise.all(models.map((model) => model.init()));

  console.log("All models initialized successfully");
};

// ==================================
// 5. START SERVER
// ==================================

const startServer = async () => {
  try {
    await connectDB();

    await initializeCollections();

    startAutoSubmitScheduler();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Allowed frontend origins:", allowedOrigins);
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
