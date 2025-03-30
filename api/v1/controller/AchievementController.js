const AchievementTemplate = require("../models/AchievementTemplate");
const Achievement = require("../models/Achievement");
const Activity = require("../models/Activity"); 

const getAchievements = async (req, res) => {
    try {
        const userId = req.user.id;
    
        // Ambil total quiz yang sudah dikerjakan user
        const totalQuiz = await Activity.countDocuments({ userId });
    
        // Ambil daftar achievement dari template
        const allAchievements = await AchievementTemplate.find().sort({"requirement" : 1});
    
        // Ambil daftar achievement yang sudah didapat user dari database AchievementUser
        const userAchievementData = await Achievement.findOne({ userId });
    
        // Ambil hanya ID achievement yang sudah diperoleh
        const obtainedAchievementIds = userAchievementData
          ? userAchievementData.achievements.map((ach) => ach.achievementId.toString())
          : [];
    
        // Tandai achievement mana yang sudah diperoleh dan mana yang belum
        const userAchievements = allAchievements.map((ach) => ({
          _id: ach._id,
          name: ach.name,
          description: ach.description,
          requirement: ach.requirement,
          obtained: obtainedAchievementIds.includes(ach._id.toString()), // True jika sudah didapat
        }));
    
        res.json(userAchievements);
      } catch (error) {
        res.status(500).json({ message: "Error fetching user achievements", error });
      }
};

const getUserAchievements = async (req, res) => {
    try {
        const userId = req.user.id;
    
        const userAchievement = await Achievement.findOne({ userId })
          .populate("achievements.achievementId")
          .sort({ "achievements.obtainedAt": -1 });
    
        if (!userAchievement || userAchievement.achievements.length === 0) {
          return res.status(200).json({ message: "No achievements found" });
        }
    
        const latestAchievement = userAchievement.achievements.sort(
          (a, b) => new Date(b.obtainedAt) - new Date(a.obtainedAt)
        )[0];
    
        res.json(latestAchievement);
      } catch (error) {
        res.status(500).json({ message: "Error fetching latest user achievement", error });
      }
};

module.exports = { getAchievements, getUserAchievements };
