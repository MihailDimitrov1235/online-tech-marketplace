import express from "express";
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  updateOrderItemStatus,
  deleteOrder,
} from "../controllers/Order.controller.js";
import protect from "../middleware/auth.js";
import restrictTo from "../middleware/restrictTo.js";

const router = express.Router();

router.get("/", protect, getOrders);
router.get("/:id", protect, getOrder);
router.post("/", protect, createOrder);
// router.patch("/:id/status", protect, restrictTo("seller"), updateOrderStatus);
router.patch("/:id/status", protect, updateOrderStatus);
router.patch(
  "/:id/items/:itemId/status",
  protect,
  restrictTo("delivery"),
  updateOrderItemStatus,
);
router.delete("/:id", protect, deleteOrder);

export default router;
