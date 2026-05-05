import express from "express";
import {
  getSellerInfo,
  getSellerInfoById,
  upsertSellerInfo,
  getUnverifiedSellers,
  verifySeller,
  rejectSeller,
} from "../controllers/Seller.controller.js";
import protect from "../middleware/auth.js";
import restrictTo from "../middleware/restrictTo.js";

const router = express.Router();

router.post("/", protect, upsertSellerInfo);
router.get("/me", protect, restrictTo("seller"), getSellerInfo);
router.get("/unverified", protect, restrictTo("admin"), getUnverifiedSellers);
router.get("/:id", getSellerInfoById);
router.patch("/:id/verify", protect, restrictTo("admin"), verifySeller);
router.delete("/:id/reject", protect, restrictTo("admin"), rejectSeller);

export default router;
