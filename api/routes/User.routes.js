import express from "express";
import User from "../models/User.model.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

export default router;
