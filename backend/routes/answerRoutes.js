
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { saveAnswer } = require("../controllers/answerController");

router.use(authMiddleware);

router.patch("/:attemptId", saveAnswer);

module.exports = router;
