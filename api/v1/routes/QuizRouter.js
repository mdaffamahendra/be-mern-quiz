const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth")
const {
  addQuiz,
  getAll,
  getQuizById,
  editQuiz,
  deleteQuiz,
} = require("../controller/QuizController");
const checkRole = require("../../middleware/role");

router.post("/quiz/add", authMiddleware, checkRole("teacher"), addQuiz);
router.get("/quiz", authMiddleware, checkRole(["teacher", "student"]),getAll);
router.get("/quiz/:quizId", authMiddleware, checkRole(["teacher", "student"]), getQuizById);
router.put("/quiz/edit/:quizId", authMiddleware, checkRole("teacher"), editQuiz);
router.delete("/quiz/delete/:quizId", authMiddleware, checkRole("teacher"), deleteQuiz);

module.exports = router;
