require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const usersRouter = require("./api/v1/routes/UsersRouter");
const quizRouter = require("./api/v1/routes/QuizRouter");
const questionRouter = require("./api/v1/routes/QuestionRouter");
const quizResultRouter = require("./api/v1/routes/QuizResultRouter");
const activityRouter = require("./api/v1/routes/ActivityRouter");
const achievementRouter = require("./api/v1/routes/AchievementRouter");
const materiRouter = require("./api/v1/routes/MateriRouter");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(express.json()); // Biar bisa handle JSON dari request
app.use(cors({ origin: "https://studywithquiz.vercel.app", credentials: true })); // Biar frontend bisa akses backend
app.use(cookieParser());

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Rute dasar
app.use("/api/v1", usersRouter);
app.use("/api/v1", questionRouter);
app.use("/api/v1", quizRouter);
app.use("/api/v1", quizResultRouter);
app.use("/api/v1", activityRouter);
app.use("/api/v1", achievementRouter);
app.use("/api/v1", materiRouter);
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
