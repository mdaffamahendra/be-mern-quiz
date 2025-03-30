const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  quizId: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{5}$/, "Quiz ID must be exactly 5 digits"],
  },
  title: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  field: {
    type: String,
    required: true,
  },
  timeStart: {
    type: Date,
    required: true,
  },
  timeEnd: {
    type: Date,
    required: true,
  },
  timer: {
    type: Number,
    required: true,
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
});

module.exports = mongoose.model("Quiz", QuizSchema);
