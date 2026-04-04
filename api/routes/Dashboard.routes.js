import express from "express";
import { getDashboardOrders } from "../controllers/Order.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/orders", protect, getDashboardOrders);

export default router;
