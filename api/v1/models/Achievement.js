const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  achievements: [
    {
      achievementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AchievementTemplate",
      },
      obtainedAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Achievement", achievementSchema);
