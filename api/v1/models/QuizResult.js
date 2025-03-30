const mongoose = require("mongoose");

const QuizResultSchema = new mongoose.Schema({
  quizId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalScore: {
    type: Number,
    required: true,
    default: 0, // Default jika tidak ada jawaban benar
  },
  duration: {
    type: Number,
    required: true,
    default: 0,
  },
  startedAt: {
    type: Date, // Waktu mulai quiz
    required: true,
  },
  completedAt: {
    type: Date, // Waktu selesai quiz
    required: true,
    default: Date.now, // Secara default diisi dengan waktu saat disimpan
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId, // ID dari soal yang dijawab
        ref: "Question",
        required: true,
      },
      selectedOption: {
        type: String, // Jawaban yang dipilih user
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("QuizResult", QuizResultSchema);
