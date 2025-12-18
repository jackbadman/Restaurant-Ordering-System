import express from "express";
import { createOrder, getOrder, getOrdersForUser } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/user/:userId", getOrdersForUser);
router.get("/:id", getOrder);

export default router;
