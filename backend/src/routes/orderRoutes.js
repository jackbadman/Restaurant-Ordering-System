import express from "express";
import { createOrder, getOrder, getOrdersForUser } from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", requireAuth, createOrder);
router.get("/user/:userId", requireAuth, getOrdersForUser);
router.get("/:id", requireAuth, getOrder);

export default router;
