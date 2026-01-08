import express from "express";
import { loginUser, registerUser, getUserProfile } from "../controllers/user.controller.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getUserProfile);

export default router;
