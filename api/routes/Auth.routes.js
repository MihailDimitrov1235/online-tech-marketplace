import express from "express";
import { authRegister, authLogin, authMe } from '../controllers/Auth.controller.js'
import protect from '../middleware/auth.js';

const router = express.Router();

router.post("/register", authRegister);
router.post("/login", authLogin);
router.get("/me", protect, authMe);

export default router;
