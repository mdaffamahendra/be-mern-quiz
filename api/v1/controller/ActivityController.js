const Activity = require("../models/Activity");

const getActivity = async (req, res) => {
  try {
    const userId = req.user.id;

    const activities = await Activity.find({ userId })
      .populate("idQuiz", "quizId title description") 
      .sort({ completedAt: -1 }); 
    return res.status(200).json({ activities });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const userId = req.user.id;

    // Cari activity berdasarkan ID dan pastikan milik user yang sesuai
    const activity = await Activity.findOne({ _id: activityId, userId });

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    await Activity.deleteOne({ _id: activityId });

    return res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


module.exports = { getActivity, deleteActivity };
