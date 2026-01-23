import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../config/generateToken.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  generateToken(user._id, user.email, user.name);

  if (user) {
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id, user.email, user.name),
      message: "User created successfully",
    });
  } else {
    res.status(400).json({ message: "Failed to create user" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Password is Incorrect" });
  }

  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
    pic: user.pic,
    token: generateToken(user._id, user.email, user.name),
    message: "User logged in successfully",
  });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
    },
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const search = req.query.search;

  const keywords = search ? {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ],
  } : {};

  const users = await User.find({
    ...keywords,
    _id: { $ne: req.user._id }, // exclude current user
  }).select("-password").sort({ createdAt: -1 });
  res.status(200).json(users);
})
export { registerUser, loginUser, getUserProfile, getAllUsers };
