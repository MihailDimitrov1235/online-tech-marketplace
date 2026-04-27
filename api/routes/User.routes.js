import express from "express";
import protect from "../middleware/auth.js";
import restrictTo from "../middleware/restrictTo.js";
import {
  getUsers,
  getUser,
  updateUserRoles,
  getDelivery,
} from "../controllers/User.controller.js";

const router = express.Router();

router.get("/:id", getUser);
router.get("/", protect, restrictTo("admin"), getUsers);
router.get("/delivery", protect, getDelivery);
router.patch("/:id/roles", protect, restrictTo("admin"), updateUserRoles);

export default router;
