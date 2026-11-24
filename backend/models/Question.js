
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
      maxlength: 1000
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (options) {
          return (
            options.length === 4 &&
            options.every(option => option.trim().length > 0) &&
            new Set(
              options.map(option => option.trim().toLowerCase())
            ).size === 4
          );
        },
        message: "Exactly four unique, non-empty options are required"
      }
    },

    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required"],
      trim: true
    },

    subject: {
      type: String,
      required: true,
      trim: true
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy"
    },

    isActive: {
      type: Boolean,
      default: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Correct answer must match one of the four options.
questionSchema.pre("validate", function () {
  if (
    this.options &&
    !this.options.includes(this.correctAnswer)
  ) {
    this.invalidate(
      "correctAnswer",
      "Correct answer must match one of the options"
    );
  }
});

questionSchema.index({ subject: 1, isActive: 1 });

module.exports = mongoose.model(
  "Question",
  questionSchema,
  "questions"
);
