import express from "express";
import protect from "../middleware/auth.js";
import restrictTo from "../middleware/restrictTo.js";
import { getUsers, updateUserRoles } from "../controllers/User.controller.js";

const router = express.Router();

router.get("/", protect, getUsers);

router.patch("/roles/:id", protect, updateUserRoles);
// router.patch("/:id/roles", protect, restrictTo("admin"), updateUserRoles);

export default router;
