
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  updateQuestionStatus,
  deleteQuestion
} = require("../controllers/questionController");

// All routes below require an authenticated admin
router.use(authMiddleware, adminMiddleware);

// Question CRUD
router.post("/questions", createQuestion);

router.get("/questions", getAllQuestions);

router.get("/questions/:id", getQuestionById);

router.put("/questions/:id", updateQuestion);

router.patch("/questions/:id/status", updateQuestionStatus);

router.delete("/questions/:id", deleteQuestion);

module.exports = router;
