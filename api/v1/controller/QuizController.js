const Quiz = require("../models/Quiz");

const addQuiz = async (req, res) => {
  try {
    const {
      quizId,
      title,
      description,
      field,
      timeStart,
      timeEnd,
      timer,
    } = req.body;

    if (
      !quizId ||
      !title ||
      !field ||
      !timeStart ||
      !timeEnd ||
      !timer
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (isNaN(Date.parse(timeStart)) || isNaN(Date.parse(timeEnd))) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if(Number(timer) < 10){
      return res.status(400).json({ message: "Waktu pengerjaan minimal 10 menit" });
    }

    // Cek apakah quizId sudah 5 digit
    if (!/^\d{5}$/.test(quizId)) {
      return res
        .status(400)
        .json({ message: "Quiz ID must be exactly 5 digits" });
    }

    // Cek apakah quizId sudah ada
    const existingQuiz = await Quiz.findOne({ quizId });
    if (existingQuiz) {
      return res.status(400).json({ message: "Quiz ID already exists" });
    }

    // Simpan quiz ke database dengan userId
    const newQuiz = new Quiz({
      quizId,
      title,
      description,
      createdBy: req.user.id,
      field,
      timeStart: new Date(timeStart),
      timeEnd: new Date(timeEnd),
      timer,
    });
    await newQuiz.save();

    const quiz = await Quiz.findById(newQuiz._id).populate(
      "createdBy",
      "_id username"
    );

    res
      .status(201)
      .json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    let { field } = req.query;
    let quizzes;

    let filter = {};
    if (field) {
      filter.field = { $regex: field, $options: "i" }; 
    }

    if (req.user.role === "teacher") {
      quizzes = await Quiz.find({ ...filter, createdBy: req.user.id }).populate("createdBy", "username");
    } else {
      quizzes = await Quiz.find(filter).select("-questions");
    }

    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    let quiz;

    if (req.user.role === "teacher") {
      quiz = await Quiz.findOne({ quizId, createdBy: req.user.id })
        .populate("createdBy", "username");
    } else {
      quiz = await Quiz.findOne({quizId}).select("-questions").populate("createdBy", "username");
    }

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const editQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const {
      title,
      description,
      field,
      timeStart,
      timeEnd,
      timer,
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updatedQuiz = await Quiz.findOneAndUpdate(
      { quizId },
      {
        title,
        description,
        field,
        timeStart,
        timeEnd,
        timer,
      },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res
      .status(200)
      .json({ message: "Quiz updated successfully", quiz: updatedQuiz });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const deletedQuiz = await Quiz.findOneAndDelete({ quizId });
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { addQuiz, getAll, getQuizById, editQuiz, deleteQuiz };
