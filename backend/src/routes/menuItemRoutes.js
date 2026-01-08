// Menu item routes with auth/role guards.
import express from "express";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItems,
  getMenuItemsByCategory,
  updateMenuItem
} from "../controllers/menuItemController.js";
import { requireAuth, requireManager } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", requireAuth, requireManager, createMenuItem);
router.get("/", getMenuItems);
router.get("/category/:categoryId", getMenuItemsByCategory);
router.put("/:id", requireAuth, requireManager, updateMenuItem);
router.delete("/:id", requireAuth, requireManager, deleteMenuItem);

export default router;
