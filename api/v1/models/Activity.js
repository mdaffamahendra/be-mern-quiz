const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  idQuiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  resultQuizId: { type: mongoose.Schema.Types.ObjectId, ref: "QuizResult", required: true },
  score: { type: Number, required: true },
  duration: { type: Number, required: true },
  completedAt: { type: Date, required: true },
});

module.exports = mongoose.model("Activity", ActivitySchema);
