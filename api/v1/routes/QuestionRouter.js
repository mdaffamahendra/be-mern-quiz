const express = require("express");
const router = express.Router();
const { upload } = require("../../middleware/multer/index");
const { addQuestion, getAll, getOne, getAllByQuizId, editQuestion, deleteQuestion } = require("../controller/QuestionsController");
const checkRole = require("../../middleware/role");
const authMiddleware = require("../../middleware/auth");

router.post("/question/add", upload.single("image"), authMiddleware, checkRole("teacher"), addQuestion);
router.get("/question", authMiddleware, getAll);
router.put("/question/edit/:id", upload.single("image"), authMiddleware, checkRole("teacher"), editQuestion);
router.get("/question/in/:id", authMiddleware, getOne);
router.get("/question/:quizId", authMiddleware, checkRole(["student", "teacher"]), getAllByQuizId);
router.delete("/question/delete/:id", authMiddleware, deleteQuestion);

router.use("/uploads", express.static("uploads"));

module.exports = router;
