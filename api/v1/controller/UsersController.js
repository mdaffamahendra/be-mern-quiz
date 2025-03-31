const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const validRoles = ["student", "teacher"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (password.length <= 7 || password.length >= 9) {
      return res.status(400).json({ message: "Password harus 8 digit" });
    }
    // Cek apakah user sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user ke database
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse._id;

    res
      .status(201)
      .json({ message: "User registered successfully", user: userResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email atau password salah" });
    }

    // Generate tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Simpan refresh token ke database
    user.refreshToken = refreshToken;
    await user.save();

    console.log("Token yang disimpan di DB:", user.refreshToken);// Debugging

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", accessToken });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


const refreshToken = async (req, res) => {
  try {
    console.log("Cookies yang diterima:", req.cookies);

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token is required" });
    }

    const user = await User.findOne({ refreshToken });
    console.log("User ditemukan:", user); // Debugging

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token User" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token jwt" });
      }

      const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "12h",
      });

      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) return res.status(204).send();

    // Hapus refresh token di database
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      return res.status(204).send();
    }

    user.refreshToken = null;
    await user.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const editUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const { id } = req.params;

    // Cek apakah user ada
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user
    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah user ada
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  signup,
  getAllUsers,
  signin,
  editUser,
  deleteUser,
  refreshToken,
  logout,
};
