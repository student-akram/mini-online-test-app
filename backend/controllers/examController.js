
const mongoose = require("mongoose");
const Question = require("../models/Question");
const Attempt = require("../models/Attempt");
const submitAttempt = require("../utils/submitAttempt");

const EXAM_DURATION_MINUTES = 10;
const TOTAL_QUESTIONS = 10;

// Send questions without exposing their correct answers
const formatAttemptForStudent = (attempt) => ({
  attemptId: attempt._id,
  status: attempt.status,
  startedAt: attempt.startedAt,
  expiresAt: attempt.expiresAt,
  totalQuestions: attempt.totalQuestions,
  questions: attempt.questions.map((question) => ({
    questionId: question.questionId,
    questionText: question.questionText,
    options: question.options,
    selectedAnswer: question.selectedAnswer
  }))
});

// Start a new exam
const startExam = async (req, res) => {
  try {
    // Check whether the student already has an active attempt
    const existingAttempt = await Attempt.findOne({
      userId: req.user._id,
      status: "in_progress"
    }).sort({ createdAt: -1 });

    if (existingAttempt) {
      if (new Date() < existingAttempt.expiresAt) {
        return res.status(200).json({
          success: true,
          message: "You already have an active exam. Resuming it.",
          attempt: formatAttemptForStudent(existingAttempt)
        });
      }

      // Expired attempts will be finalized by the timer/submission logic
      return res.status(409).json({
        success: false,
        message: "Your previous exam has expired. Submit or retrieve its result before starting another exam."
      });
    }

    // Randomly select 10 active questions
    const selectedQuestions = await Question.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: TOTAL_QUESTIONS } }
    ]);

    if (selectedQuestions.length < TOTAL_QUESTIONS) {
      return res.status(400).json({
        success: false,
        message: `At least ${TOTAL_QUESTIONS} active questions are required to start an exam.`
      });
    }

    const startedAt = new Date();

    const expiresAt = new Date(
      startedAt.getTime() + EXAM_DURATION_MINUTES * 60 * 1000
    );

    // Store a snapshot so future admin edits don't change this exam
    const questionSnapshots = selectedQuestions.map((question) => ({
      questionId: question._id,
      questionText: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      selectedAnswer: null
    }));

    const attempt = await Attempt.create({
      userId: req.user._id,
      questions: questionSnapshots,
      totalQuestions: TOTAL_QUESTIONS,
      startedAt,
      expiresAt,
      status: "in_progress"
    });

    return res.status(201).json({
      success: true,
      message: "Exam started successfully",
      attempt: formatAttemptForStudent(attempt)
    });
  } catch (error) {
    console.error("Start exam error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to start exam"
    });
  }
};

// Get the student's current attempt after refresh
const getCurrentAttempt = async (req, res) => {
  try {
    const attempt = await Attempt.findOne({
      userId: req.user._id,
      status: "in_progress"
    }).sort({ createdAt: -1 });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "No active exam found"
      });
    }

if (new Date() >= attempt.expiresAt) {
  const result = await submitAttempt(attempt._id, "auto");

  return res.status(200).json({
    success: true,
    expired: true,
    message: "Exam time expired and was automatically submitted",
    result
  });
}

    return res.status(200).json({
      success: true,
      message: "Active exam retrieved successfully",
      attempt: formatAttemptForStudent(attempt)
    });
  } catch (error) {
    console.error("Get current attempt error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve current exam"
    });
  }
};

module.exports = {
  startExam,
  getCurrentAttempt
};
