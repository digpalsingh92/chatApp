import express from "express";
import { loginUser, registerUser, getUserProfile, getAllUsers } from "../controllers/user.controller.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(protect, getUserProfile);
router.route("/").get(protect, getAllUsers);

export default router;
