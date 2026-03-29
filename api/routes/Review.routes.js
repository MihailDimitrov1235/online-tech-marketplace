import express from "express";
import {
  getProductReviews,
  createProductReview,
  updateProductReview,
  deleteProductReview,
} from "../controllers/Review.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProductReviews);
router.post("/", protect, createProductReview);
router.patch("/:id", protect, updateProductReview);
router.delete("/:id", protect, deleteProductReview);

export default router;
