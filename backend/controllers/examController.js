
const Question = require("../models/Question");
const Attempt = require("../models/Attempt");
const submitAttempt = require("../utils/submitAttempt");

const EXAM_DURATION_MINUTES = 10;
const TOTAL_QUESTIONS = 10;

// Format attempt without exposing correct answers
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
    selectedAnswer: question.selectedAnswer,
  })),
});

// ==========================================
// START NEW EXAM
// ==========================================

const startExam = async (req, res) => {
  try {
    // 1. Check for an existing in-progress attempt
    const existingAttempt = await Attempt.findOne({
      userId: req.user._id,
      status: "in_progress",
    }).sort({ createdAt: -1 });

    // 2. Resume existing attempt instead of generating new questions
    if (existingAttempt) {
      if (new Date() < existingAttempt.expiresAt) {
        return res.status(200).json({
          success: true,
          message: "Resuming your existing exam.",
          attempt: formatAttemptForStudent(existingAttempt),
        });
      }

      // Automatically submit expired attempt
      const result = await submitAttempt(
        existingAttempt._id,
        "auto"
      );

      return res.status(200).json({
        success: true,
        expired: true,
        message: "Your previous exam expired and was submitted.",
        result,
      });
    }

    // 3. Get total number of active questions
    const activeQuestionCount = await Question.countDocuments({
      isActive: true,
    });

    if (activeQuestionCount < TOTAL_QUESTIONS) {
      return res.status(400).json({
        success: false,
        message: `At least ${TOTAL_QUESTIONS} active questions are required. Currently available: ${activeQuestionCount}.`,
      });
    }

    // 4. Randomly select exactly 10 active questions
    const selectedQuestions = await Question.aggregate([
      {
        $match: {
          isActive: true,
        },
      },
      {
        $sample: {
          size: TOTAL_QUESTIONS,
        },
      },
    ]);

    if (selectedQuestions.length !== TOTAL_QUESTIONS) {
      return res.status(400).json({
        success: false,
        message: "Unable to select 10 questions. Please try again.",
      });
    }

    // 5. Create exam timer
    const startedAt = new Date();

    const expiresAt = new Date(
      startedAt.getTime() +
        EXAM_DURATION_MINUTES * 60 * 1000
    );

    // 6. Save question snapshots
    // Correct answers are stored only on the backend
    const questionSnapshots = selectedQuestions.map((question) => ({
      questionId: question._id,
      questionText: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      selectedAnswer: null,
    }));

    // 7. Create a new attempt
    const attempt = await Attempt.create({
      userId: req.user._id,
      questions: questionSnapshots,
      totalQuestions: TOTAL_QUESTIONS,
      startedAt,
      expiresAt,
      status: "in_progress",
    });

    // 8. Return questions without correct answers
    return res.status(201).json({
      success: true,
      message: "New randomized exam started successfully.",
      attempt: formatAttemptForStudent(attempt),
    });

  } catch (error) {
    console.error("Start exam error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to start exam.",
    });
  }
};

// ==========================================
// GET CURRENT ATTEMPT AFTER PAGE REFRESH
// ==========================================

const getCurrentAttempt = async (req, res) => {
  try {
    const attempt = await Attempt.findOne({
      userId: req.user._id,
      status: "in_progress",
    }).sort({ createdAt: -1 });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "No active exam found.",
      });
    }

    // Check whether the exam timer has expired
    if (new Date() >= attempt.expiresAt) {
      const result = await submitAttempt(
        attempt._id,
        "auto"
      );

      return res.status(200).json({
        success: true,
        expired: true,
        message: "Exam time expired and was automatically submitted.",
        result,
      });
    }

    // Return the same saved questions
    return res.status(200).json({
      success: true,
      message: "Existing exam retrieved successfully.",
      attempt: formatAttemptForStudent(attempt),
    });

  } catch (error) {
    console.error("Get current attempt error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve current exam.",
    });
  }
};

module.exports = {
  startExam,
  getCurrentAttempt,
};
