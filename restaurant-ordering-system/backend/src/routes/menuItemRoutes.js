import express from "express";
import { createMenuItem, getMenuItems, getMenuItemsByCategory } from "../controllers/menuItemController.js";

const router = express.Router();

router.post("/", createMenuItem);
router.get("/", getMenuItems);
router.get("/category/:categoryId", getMenuItemsByCategory);

export default router;