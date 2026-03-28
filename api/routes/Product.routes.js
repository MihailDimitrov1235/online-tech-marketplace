import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/Product.controller.js";
import protect from "../middleware/auth.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", protect, upload.array("images"), createProduct);
router.patch("/:id", protect, upload.array("images"), updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
