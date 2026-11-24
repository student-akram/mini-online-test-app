
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getAttemptHistory } = require("../controllers/historyController");

router.use(authMiddleware);

router.get("/", getAttemptHistory);

module.exports = router;
