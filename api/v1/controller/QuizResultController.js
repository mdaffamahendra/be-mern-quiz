const QuizResult = require("../models/QuizResult");
const Quiz = require("../models/Quiz");
const Questions = require("../models/Questions");
const Activity = require("../models/Activity");
const Achievement = require("../models/Achievement");
const AchievementTemplate = require("../models/AchievementTemplate");

const submitQuiz = async (req, res) => {
  try {
    const { quizId, userId, startedAt, completedAt, answers } = req.body;

    if (!startedAt || !quizId || !userId || !completedAt || !answers) {
      return res.status(400).json({ message: "Something wrong" });
    }
    if (!Array.isArray(answers) || answers.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one answer is required" });
    }

    // Validasi apakah quiz ada
    const quiz = await Quiz.findOne({ quizId });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Ambil semua pertanyaan berdasarkan quizId
    const questions = await Questions.find({ quizId });

    let totalScore = 0;
    let processedAnswers = [];

    // Loop untuk memproses jawaban user
    answers.forEach((answer, index) => {
      if (!answer.selectedOption) {
        return res.status(400).json({
          message: `Selected option for question ${index + 1} is required`,
        });
      }

      const question = questions.find(
        (q) => q._id.toString() === answer.questionId
      );
      if (!question) return;

      const isCorrect = question.correctAnswer === answer.selectedOption;
      const score = isCorrect ? question.score : 0;

      totalScore += score;

      processedAnswers.push({
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        isCorrect,
      });
    });

    const startedAtDate = new Date(startedAt);
    const completedAtDate = new Date(completedAt);

    const duration = Math.floor((completedAtDate - startedAtDate) / 1000);

    // Simpan hasil quiz ke database
    const quizResult = new QuizResult({
      quizId,
      userId,
      totalScore,
      answers: processedAnswers,
      startedAt: startedAtDate,
      completedAt: completedAtDate,
      duration,
    });
    await quizResult.save();

    const result = quizResult.toObject();

    const userActivity = new Activity({
      userId,
      idQuiz: quiz._id,
      resultQuizId: result._id,
      score: totalScore,
      duration,
      completedAt: completedAtDate,
    });
    await userActivity.save();

    const totalQuiz = await Activity.countDocuments({ userId });

    const achievementTemplates = await AchievementTemplate.find();
    const newAchievements = achievementTemplates.filter(
      (ach) => totalQuiz === ach.requirement
    );

    let userAchievement = await Achievement.findOne({ userId });

    if (!userAchievement) {
      userAchievement = new Achievement({ userId, achievements: [] });
    }

    newAchievements.forEach((ach) => {
      userAchievement.achievements.push({
        achievementId: ach._id,
        obtainedAt: new Date(),
      });
    });

    await userAchievement.save();

    return res
      .status(201)
      .json({
        message: "Quiz submitted successfully",
        quizResult,
        userActivity,
        newAchievements,
      });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getQuizResult = async (req, res) => {
  try {
    const { id } = req.params;

    // Validasi apakah quizId dan userId ada
    if (!id) {
      return res.status(400).json({ message: "Id are required" });
    }

    // Cari hasil quiz berdasarkan quizId dan userId
    const quizResult = await QuizResult.findById(id)
      .populate("userId", "email username")
      .populate({
        path: "answers.questionId",
        select: "question score options correctAnswer image",
      });

    if (!quizResult) {
      return res.status(404).json({ message: "Quiz result not found" });
    }

    return res.status(200).json({ message: "Quiz result found", quizResult });
  } catch (error) {
    console.error("Error fetching quiz result:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { role } = req.user;
    let leaderboard;

    if (!quizId) {
      return res.status(400).json({ message: "quizId is required" });
    }

    const quiz = await Quiz.findOne({ quizId })
      .select("-questions")
      .populate("createdBy", "username");

    if (role === "teacher") {
      leaderboard = await QuizResult.find({ quizId })
        .sort({ totalScore: -1 })
        .populate("userId", "email username")
        .select("-answers");
    } else {
      leaderboard = await QuizResult.find({ quizId })
        .sort({ totalScore: -1 })
        .limit(10)
        .populate("userId", "email username")
        .select("-answers");
    }

    return res
      .status(200)
      .json({ message: "Leaderboard fetched successfully", leaderboard, quiz });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = {
  submitQuiz,
  getQuizResult,
  getLeaderboard,
};
