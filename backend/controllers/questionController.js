
const mongoose = require("mongoose");
const Question = require("../models/Question");

// CREATE QUESTION
const createQuestion = async (req, res) => {
  try {
    const {
      question,
      options,
      correctAnswer,
      subject,
      difficulty
    } = req.body;

    if (
      typeof question !== "string" ||
      !question.trim() ||
      !Array.isArray(options) ||
      !correctAnswer ||
      typeof subject !== "string" ||
      !subject.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All required question fields must be provided"
      });
    }

    if (
      options.length !== 4 ||
      !options.every(
        option => typeof option === "string" && option.trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Exactly four non-empty options are required"
      });
    }

    const normalizedOptions = options.map(option => option.trim());

    const uniqueOptions = new Set(
      normalizedOptions.map(option => option.toLowerCase())
    );

    if (uniqueOptions.size !== 4) {
      return res.status(400).json({
        success: false,
        message: "All four options must be unique"
      });
    }

    if (!normalizedOptions.includes(correctAnswer.trim())) {
      return res.status(400).json({
        success: false,
        message: "Correct answer must match one of the options"
      });
    }

    const validDifficulties = ["easy", "medium", "hard"];

    const selectedDifficulty = difficulty || "easy";

    if (!validDifficulties.includes(selectedDifficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty level"
      });
    }

    const newQuestion = await Question.create({
      question: question.trim(),
      options: normalizedOptions,
      correctAnswer: correctAnswer.trim(),
      subject: subject.trim(),
      difficulty: selectedDifficulty,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Question created successfully",
      question: newQuestion
    });

  } catch (error) {
    console.error("Create question error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create question"
    });
  }
};


// GET ALL QUESTIONS WITH SEARCH AND FILTERS
const getAllQuestions = async (req, res) => {
  try {
    const {
      search,
      subject,
      difficulty,
      status,
      page = 1,
      limit = 10
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      !Number.isInteger(pageNumber) ||
      !Number.isInteger(limitNumber) ||
      pageNumber < 1 ||
      limitNumber < 1 ||
      limitNumber > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination values"
      });
    }

    const filter = {};

    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.question = {
        $regex: safeSearch,
        $options: "i"
      };
    }

    if (subject) {
      filter.subject = subject;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (status === "active") {
      filter.isActive = true;
    } else if (status === "inactive") {
      filter.isActive = false;
    } else if (status && status !== "all") {
      return res.status(400).json({
        success: false,
        message: "Invalid status filter"
      });
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [questions, totalQuestions] = await Promise.all([
      Question.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),

      Question.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      totalQuestions,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalQuestions / limitNumber),
      questions
    });

  } catch (error) {
    console.error("Get questions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch questions"
    });
  }
};


// GET SINGLE QUESTION
const getQuestionById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID"
      });
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    return res.status(200).json({
      success: true,
      question
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch question"
    });
  }
};


// UPDATE QUESTION
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID"
      });
    }

    const allowedFields = [
      "question",
      "options",
      "correctAnswer",
      "subject",
      "difficulty"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update"
      });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    if (updates.question !== undefined) {
      if (
        typeof updates.question !== "string" ||
        !updates.question.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid question text"
        });
      }

      question.question = updates.question.trim();
    }

    if (updates.options !== undefined) {
      if (
        !Array.isArray(updates.options) ||
        updates.options.length !== 4 ||
        !updates.options.every(
          option => typeof option === "string" && option.trim()
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Exactly four non-empty options are required"
        });
      }

      const normalized = updates.options.map(option => option.trim());

      if (
        new Set(normalized.map(option => option.toLowerCase())).size !== 4
      ) {
        return res.status(400).json({
          success: false,
          message: "Options must be unique"
        });
      }

      question.options = normalized;
    }

    if (updates.correctAnswer !== undefined) {
      if (
        typeof updates.correctAnswer !== "string" ||
        !updates.correctAnswer.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid correct answer"
        });
      }

      question.correctAnswer = updates.correctAnswer.trim();
    }

    if (updates.subject !== undefined) {
      if (
        typeof updates.subject !== "string" ||
        !updates.subject.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid subject"
        });
      }

      question.subject = updates.subject.trim();
    }

    if (updates.difficulty !== undefined) {
      if (!["easy", "medium", "hard"].includes(updates.difficulty)) {
        return res.status(400).json({
          success: false,
          message: "Invalid difficulty"
        });
      }

      question.difficulty = updates.difficulty;
    }

    await question.save();

    return res.status(200).json({
      success: true,
      message: "Question updated successfully",
      question
    });

  } catch (error) {
    console.error("Update question error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update question"
    });
  }
};


// ACTIVATE / DEACTIVATE QUESTION
const updateQuestionStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false"
      });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID"
      });
    }

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: `Question ${isActive ? "activated" : "deactivated"} successfully`,
      question
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update question status"
    });
  }
};


// SOFT DELETE QUESTION
const deleteQuestion = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID"
      });
    }

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question deactivated successfully",
      questionId: question._id
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete question"
    });
  }
};


module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  updateQuestionStatus,
  deleteQuestion
};
