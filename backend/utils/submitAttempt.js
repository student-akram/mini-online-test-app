
const Attempt = require("../models/Attempt");

const submitAttempt = async (attemptId, submissionType = "manual") => {
  const attempt = await Attempt.findById(attemptId);

  if (!attempt) {
    throw new Error("Attempt not found");
  }

  // Prevent duplicate submission
  if (attempt.status === "submitted") {
    return attempt;
  }

  const now = new Date();

  // Automatic submission is allowed only after expiry
  if (submissionType === "auto" && now < attempt.expiresAt) {
    return null;
  }

  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  for (const question of attempt.questions) {
    if (!question.selectedAnswer) {
      unansweredCount++;
    } else if (question.selectedAnswer === question.correctAnswer) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  }

  const score = correctCount;

  // Atomically allow only one request to finalize this attempt
  const submittedAttempt = await Attempt.findOneAndUpdate(
    {
      _id: attemptId,
      status: "in_progress"
    },
    {
      $set: {
        score,
        correctCount,
        incorrectCount,
        unansweredCount,
        status: "submitted",
        submittedAt: now,
        submissionType
      }
    },
    { new: true, runValidators: true }
  );

  // Another request may have submitted it first
  if (!submittedAttempt) {
    return await Attempt.findById(attemptId);
  }

  return submittedAttempt;
};

module.exports = submitAttempt;
