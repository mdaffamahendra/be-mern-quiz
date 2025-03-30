const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const checkRole = require("../../middleware/role");
const { getActivity, deleteActivity } = require("../controller/ActivityController");

router.get("/activity", authMiddleware, checkRole("student"), getActivity);
router.delete("/activity/:activityId", authMiddleware, checkRole("student"), deleteActivity);

module.exports = router;
