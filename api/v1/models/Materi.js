const mongoose = require("mongoose");

const MateriSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  field: {
    type: String,
    required: true,
  },
  content: {
    type: String, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Materi", MateriSchema);
