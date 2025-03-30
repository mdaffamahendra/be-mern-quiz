const mongoose = require("mongoose");

const AchievementTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  requirement: { type: Number, required: true }, 
});

module.exports = mongoose.model("AchievementTemplate", AchievementTemplateSchema);


