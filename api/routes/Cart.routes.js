import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} from "../controllers/Cart.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.patch("/:id", protect, updateCartItem);
router.delete("/:id", protect, removeFromCart);

export default router;
