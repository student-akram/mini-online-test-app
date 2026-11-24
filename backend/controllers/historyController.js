
const mongoose = require("mongoose");
const Attempt = require("../models/Attempt");

const getAttemptHistory = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    // Validate pagination
    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be positive integers"
      });
    }

    // Prevent excessively large responses
    limit = Math.min(limit, 50);

    const skip = (page - 1) * limit;

    // Only show this student's submitted attempts
    const filter = {
      userId: req.user._id,
      status: "submitted"
    };

    const [attempts, totalAttempts] = await Promise.all([
      Attempt.find(filter)
        .select(
          "score totalQuestions correctCount incorrectCount unansweredCount startedAt submittedAt submissionType status"
        )
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Attempt.countDocuments(filter)
    ]);

    const history = attempts.map((attempt) => ({
      attemptId: attempt._id,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      correctCount: attempt.correctCount,
      incorrectCount: attempt.incorrectCount,
      unansweredCount: attempt.unansweredCount,
      percentage: attempt.totalQuestions
        ? Number(
            ((attempt.score / attempt.totalQuestions) * 100).toFixed(2)
          )
        : 0,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      submissionType: attempt.submissionType
    }));

    return res.status(200).json({
      success: true,
      message: "Exam history retrieved successfully",
      pagination: {
        currentPage: page,
        totalAttempts,
        totalPages: Math.ceil(totalAttempts / limit),
        limit
      },
      history
    });
  } catch (error) {
    console.error("Get attempt history error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve exam history"
    });
  }
};

module.exports = { getAttemptHistory };
