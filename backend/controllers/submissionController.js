
const mongoose = require("mongoose");
const Attempt = require("../models/Attempt");
const submitAttempt = require("../utils/submitAttempt");

// Manually submit an exam
const submitExam = async (req, res) => {
  try {
    const { attemptId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attempt ID"
      });
    }

    const attempt = await Attempt.findOne({
      _id: attemptId,
      userId: req.user._id
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found"
      });
    }

    const submissionType =
      new Date() >= attempt.expiresAt ? "auto" : "manual";

    const result = await submitAttempt(attemptId, submissionType);

    return res.status(200).json({
      success: true,
      message: "Exam submitted successfully",
      result
    });
  } catch (error) {
    console.error("Submit exam error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit exam"
    });
  }
};

// Retrieve a submitted result
const getExamResult = async (req, res) => {
  try {
    const { attemptId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attempt ID"
      });
    }

    const attempt = await Attempt.findOne({
      _id: attemptId,
      userId: req.user._id
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found"
      });
    }

    if (attempt.status !== "submitted") {
      return res.status(409).json({
        success: false,
        message: "Exam has not been submitted yet"
      });
    }

    return res.status(200).json({
      success: true,
      result: {
        attemptId: attempt._id,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        correctCount: attempt.correctCount,
        incorrectCount: attempt.incorrectCount,
        unansweredCount: attempt.unansweredCount,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
        submissionType: attempt.submissionType,
        questions: attempt.questions.map((question) => ({
          questionId: question.questionId,
          questionText: question.questionText,
          options: question.options,
          selectedAnswer: question.selectedAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect:
            question.selectedAnswer === question.correctAnswer
        }))
      }
    });
  } catch (error) {
    console.error("Get result error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve exam result"
    });
  }
};

module.exports = {
  submitExam,
  getExamResult
};
