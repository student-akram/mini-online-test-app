
const mongoose = require("mongoose");
const Attempt = require("../models/Attempt");
const submitAttempt = require("../utils/submitAttempt");

// Save or update a student's answer
const saveAnswer = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { questionId, selectedAnswer } = req.body;

    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attempt ID"
      });
    }

    if (!questionId || !mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({
        success: false,
        message: "Valid question ID is required"
      });
    }

    if (typeof selectedAnswer !== "string" || !selectedAnswer.trim()) {
      return res.status(400).json({
        success: false,
        message: "Selected answer is required"
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

    if (attempt.status === "submitted") {
      return res.status(409).json({
        success: false,
        message: "This exam has already been submitted"
      });
    }

    // Check deadline using server time
    if (new Date() >= attempt.expiresAt) {
      const result = await submitAttempt(attempt._id, "auto");

      return res.status(409).json({
        success: false,
        message: "Exam time has expired. Your exam was automatically submitted.",
        result
      });
    }

    const question = attempt.questions.find(
      (item) => item.questionId.toString() === questionId
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question does not belong to this attempt"
      });
    }

    // Only allow an option that belongs to this question
    if (!question.options.includes(selectedAnswer)) {
      return res.status(400).json({
        success: false,
        message: "Selected answer is not a valid option"
      });
    }

    question.selectedAnswer = selectedAnswer;

    await attempt.save();

    return res.status(200).json({
      success: true,
      message: "Answer saved successfully",
      questionId,
      selectedAnswer
    });
  } catch (error) {
    console.error("Save answer error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save answer"
    });
  }
};

module.exports = { saveAnswer };
