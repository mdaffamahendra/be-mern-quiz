const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const {
  submitQuiz,
  getQuizResult,
  getLeaderboard,
} = require("../controller/QuizResultController");
const checkRole = require("../../middleware/role");

router.post("/submit-quiz", authMiddleware, checkRole("student"), submitQuiz);
router.get(
  "/result-quiz/:id",
  authMiddleware,
  checkRole(["student", "teacher"]),
  getQuizResult
);
router.get(
  "/leaderboard/:quizId",
  authMiddleware,
  checkRole(["student", "teacher"]),
  getLeaderboard
);

module.exports = router;
