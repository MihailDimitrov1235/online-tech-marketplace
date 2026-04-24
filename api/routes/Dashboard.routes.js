import express from "express";
import {
  getDashboardOrders,
  getDashboardDeliveryOrders,
} from "../controllers/Order.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/orders", protect, getDashboardOrders);
router.get("/deliveries", protect, getDashboardDeliveryOrders);

export default router;
