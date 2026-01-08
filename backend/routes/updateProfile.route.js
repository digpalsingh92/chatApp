import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import updateProfile from "../controllers/profile.controller.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.put(
  "/",
  protect,
  upload.single("image"),
  updateProfile
);

export default router;
