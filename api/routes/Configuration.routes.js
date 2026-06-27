import express from "express";
import {
  getConfigurations,
  getConfiguration,
  createConfiguration,
  updateConfiguration,
  deleteConfiguration,
  cloneConfiguration,
  buyConfiguration,
} from "../controllers/Configuration.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", getConfigurations);
router.get("/:id", getConfiguration);
router.post("/", protect, createConfiguration);
router.patch("/:id", protect, updateConfiguration);
router.delete("/:id", protect, deleteConfiguration);
router.post("/:id/clone", protect, cloneConfiguration);
router.post("/:id/buy", protect, buyConfiguration);

export default router;
