import express from "express";
import { accessChat, fetchChats } from "../controllers/chat.controller.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);

export default router;
