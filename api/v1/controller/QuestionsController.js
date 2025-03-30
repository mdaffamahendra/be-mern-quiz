const Question = require("../models/Questions");
const Quiz = require("../models/Quiz");

const addQuestion = async (req, res) => {
  try {
    const { quizId, question, options, correctAnswer, score } = req.body;
    let parsedOptions;

    if (!quizId || !question || !options || !correctAnswer || !score) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      parsedOptions = JSON.parse(options);
      if (!Array.isArray(parsedOptions) || parsedOptions.length !== 4) {
        return res
          .status(400)
          .json({ message: "Opsi jawaban harus diisi semua" });
      }
    } catch (error) {
      return res.status(400).json({ message: "Invalid options format" });
    }

    if (!parsedOptions.includes(correctAnswer)) {
      return res.status(400).json({
        message:
          "Jawaban benar wajib sama dengan salah satu atau lebih jawaban di opsi",
      });
    }

    // Jika ada file gambar, simpan path-nya
    let imageUrl = null;
    if (req.file) {
      imageUrl = req.file.path; 
    }
    const existingQuiz = await Quiz.findOne({ quizId });
    if (!existingQuiz) {
      return res.status(400).json({ message: "Quiz ID salah" });
    }

    const newQuestion = new Question({
      quizId,
      question,
      options: JSON.parse(options),
      correctAnswer,
      image: imageUrl,
      score
    });

    await newQuestion.save();
    res
      .status(201)
      .json({ message: "Question added successfully", newQuestion });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Questions
const getAll = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findOne({ _id: id });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Edit Question
const editQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { quizId, question, options, correctAnswer, score } = req.body;

    if (!quizId || !question || !options || !correctAnswer || !score) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let parsedOptions;
    try {
      parsedOptions = JSON.parse(options);
      if (!Array.isArray(parsedOptions) || parsedOptions.length !== 4) {
        return res
          .status(400)
          .json({ message: "Opsi jawaban harus diisi semua" });
      }
    } catch (error) {
      return res.status(400).json({ message: "Invalid options format" });
    }

    if (!parsedOptions.includes(correctAnswer)) {
      return res.status(400).json({
        message:
          "Jawaban benar wajib sama dengan salah satu atau lebih jawaban di opsi",
      });
    }

    // Jika ada file gambar, perbarui path-nya
    let imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updatedData = {
      quizId,
      question,
      options: JSON.parse(options),
      correctAnswer,
      score
    };

    if (imageUrl) updatedData.image = imageUrl;

    const updatedQuestion = await Question.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question updated successfully", updatedQuestion });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getAllByQuizId = async (req, res) => {
  try {
    let quiz;
    const { quizId } = req.params;
    const userId = req.user.id;
    
    if (req.user.role === "teacher") {
      quiz = await Quiz.findOne({ quizId, createdBy: userId });
    } else {
      quiz = await Quiz.findOne({ quizId });
    }

    if (!quiz) {
      return res.status(403).json({ message: "Quiz not found" });
    }
    const questions = await Question.find({ quizId });

    if (!questions) {
      return res
        .status(404)
        .json({ message: "No questions found for this quiz" });
    }

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  addQuestion,
  getAll,
  getOne,
  getAllByQuizId,
  editQuestion,
  deleteQuestion,
};
