
const mongoose = require("mongoose");

const questionSnapshotSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true
    },

    questionText: {
      type: String,
      required: true
    },

    options: {
      type: [String],
      required: true
    },

    correctAnswer: {
      type: String,
      required: true
    },

    selectedAnswer: {
      type: String,
      default: null
    }
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    questions: {
      type: [questionSnapshotSchema],
      required: true
    },

    score: {
      type: Number,
      default: 0,
      min: 0
    },

    totalQuestions: {
      type: Number,
      required: true,
      default: 10
    },

    correctCount: {
      type: Number,
      default: 0
    },

    incorrectCount: {
      type: Number,
      default: 0
    },

    unansweredCount: {
      type: Number,
      default: 0
    },

    startedAt: {
      type: Date,
      required: true
    },

    expiresAt: {
      type: Date,
      required: true
    },

    submittedAt: {
      type: Date,
      default: null
    },

    status: {
      type: String,
      enum: ["in_progress", "submitted"],
      default: "in_progress"
    },

    submissionType: {
      type: String,
      enum: ["manual", "auto"],
      default: null
    }
  },
  {
    timestamps: true
  }
);

attemptSchema.index({ userId: 1, createdAt: -1 });

attemptSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model(
  "Attempt",
  attemptSchema,
  "attempts"
);
