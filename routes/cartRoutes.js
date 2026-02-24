import express from "express";
import { addToCart, getCart, updateQty, removeItem } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);

// Update quantity for a cart item
router.put("/:itemId", protect, updateQty);

// Remove an item
router.delete("/:itemId", protect, removeItem);

export default router;
