import express from "express";
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/Cart.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getOrders);
router.get("/:id", protect, getOrder);
router.post("/", protect, createOrder);
router.patch("/:id", protect, updateOrderStatus);
router.delete("/:id", protect, deleteOrder);

export default router;
