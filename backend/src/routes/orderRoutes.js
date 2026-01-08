// Order routes with auth/role guards.
import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrder,
  getOrdersForUser,
  updateOrderStatus
} from "../controllers/orderController.js";
import { requireAuth, requireStaff } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", requireAuth, createOrder);
router.get("/", requireAuth, requireStaff, getAllOrders);
router.get("/user/:userId", requireAuth, getOrdersForUser);
router.patch("/:id/status", requireAuth, requireStaff, updateOrderStatus);
router.get("/:id", requireAuth, getOrder);

export default router;
