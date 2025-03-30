const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  quizId: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{5}$/.test(v); // Cek apakah terdiri dari 5 digit angka
      },
      message: "Quiz ID must be exactly 5 digits.",
    },
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length === 4;
      },
      message: "Must provide exactly 4 answer options",
    },
  },
  correctAnswer: {
    type: String,
    required: true,
    validate: {
      validator: function (answer) {
        return this.options.includes(answer);
      },
      message: "Correct answer must be one of the provided options",
    },
  },
  image: { type: String, default: null },
  score: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Question", QuestionSchema);
