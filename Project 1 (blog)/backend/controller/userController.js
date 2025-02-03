const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../utils/generateToken");
const { generateRefreshToken } = require("../utils/generateToken");
const { response } = require("express");
require("dotenv").config();

// Register new user
const userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = new User({
    name,
    email,
    password,
  });

  try {
    const isExisting = await User.findOne({ email });
    if (isExisting) {
      return res
        .status(400)
        .json({ message: "User already exists in the application" });
    }

    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt);
    // Hash password
    newUser.password = hashedPassword;

    await newUser.save();
    return res.status(200).json({ message: "User saved successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Server error: ${error.message}` }); // Fixed here
  }
};

// Login user
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await User.findOne({ email }); // Search by email
    if (!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const accessToken = generateAccessToken(foundUser);
    const refreshToken = generateRefreshToken(foundUser);

    res.status(200).json({
      status: "success",
      message: "logged in successfully",
      data: {
        id: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

//Get User Details
const userDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.statue(404).json({ message: "user not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching the user:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Logout user
const userLogout = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOneAndUpdate(
      { username: username },
      { $unset: { jwtToken: "" } },
      { new: true }
    );

    if (!user) {
      return res.status(401).json({
        status: "failure",
        message: "User not found",
      });
    }
    
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");

    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500),
      json({
        status: "failure",
        message: error.message,
      });
  }
};

module.exports = { userRegister, userLogin, userDetail, userLogout };
