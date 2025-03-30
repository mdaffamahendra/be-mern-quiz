const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const { getAchievements, getUserAchievements } = require("../controller/AchievementController");
const checkRole = require("../../middleware/role");

router.get("/achievements", authMiddleware, checkRole("student"), getAchievements);
router.get("/user-achievements", authMiddleware, checkRole("student"), getUserAchievements);

module.exports = router;
