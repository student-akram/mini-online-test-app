
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  submitExam,
  getExamResult
} = require("../controllers/submissionController");

router.use(authMiddleware);

router.post("/:attemptId/submit", submitExam);
router.get("/:attemptId/result", getExamResult);

module.exports = router;
