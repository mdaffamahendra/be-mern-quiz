const express = require("express");
const router = express.Router();
const {signup, signin, getAllUsers, editUser, deleteUser, refreshToken, logout} = require("../controller/UsersController")

// Register User
router.post("/auth/signup", signup);
router.post("/auth/signin", signin);
router.post("/auth/refresh", refreshToken); 
router.post("/auth/logout", logout);

// User Management
router.get("/users", getAllUsers);
router.put("/users/:id", editUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
