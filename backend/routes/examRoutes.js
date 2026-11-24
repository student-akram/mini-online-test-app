
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  startExam,
  getCurrentAttempt
} = require("../controllers/examController");

// All exam routes require authentication
router.use(authMiddleware);

// Start an exam
router.post("/start", startExam);

// Resume current exam after refresh
router.get("/current", getCurrentAttempt);

module.exports = router;
