
const Attempt = require("../models/Attempt");
const submitAttempt = require("./submitAttempt");

let isProcessing = false;

const processExpiredAttempts = async () => {
  if (isProcessing) return;

  isProcessing = true;

  try {
    const expiredAttempts = await Attempt.find({
      status: "in_progress",
      expiresAt: { $lte: new Date() }
    }).select("_id");

    for (const attempt of expiredAttempts) {
      try {
        await submitAttempt(attempt._id, "auto");

        console.log(
          `Automatically submitted expired attempt: ${attempt._id}`
        );
      } catch (error) {
        console.error(
          `Auto-submit failed for ${attempt._id}:`,
          error.message
        );
      }
    }
  } catch (error) {
    console.error("Auto-submit scheduler error:", error.message);
  } finally {
    isProcessing = false;
  }
};

const startAutoSubmitScheduler = () => {
  // Process expired attempts immediately on server startup
  processExpiredAttempts();

  // Check every 5 seconds
  setInterval(processExpiredAttempts, 5000);

  console.log("Auto-submit scheduler started");
};

module.exports = startAutoSubmitScheduler;
