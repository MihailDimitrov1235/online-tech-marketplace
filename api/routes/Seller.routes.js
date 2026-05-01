import express from "express";
import {
  getSellerInfo,
  getSellerInfoById,
  upsertSellerInfo,
} from "../controllers/Seller.controller.js";
import protect from "../middleware/auth.js";
import restrictTo from "../middleware/restrictTo.js";

const router = express.Router();

router.get("/me", protect, restrictTo("seller"), getSellerInfo);
router.get("/:id", getSellerInfoById);
router.post("/", protect, upsertSellerInfo);

export default router;
