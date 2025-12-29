import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import MenuItem from "../models/MenuItem.js";
import mongoose from "mongoose";
import { getIO } from "../socket.js";

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user?.userId || req.body.userId;

    if (!req.user?.userId && req.body.userId && !mongoose.Types.ObjectId.isValid(req.body.userId)) {
      return res.status(400).json({ message: "Invalid user id format" });
    }

    if (!req.user?.userId && req.body.userId) {
      if (req.body.userId !== userId.toString()) {
        return res.status(400).json({ message: "User id mismatch" });
      }
    }

    if (!userId) {
      return res.status(400).json({ message: "User id is required" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "At least one item is required" });
    }

    console.log("createOrder payload", {
      userId: userId?.toString(),
      itemsCount: Array.isArray(items) ? items.length : 0
    });

    const order = await Order.create({ userId });

    for (let item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        await Order.deleteOne({ _id: order._id });
        return res.status(400).json({ message: "Invalid menu item" });
      }
      await OrderItem.create({
        orderId: order._id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    try {
      const io = getIO();
      io.emit("orderCreated", {
        orderId: order._id.toString(),
        status: order.status,
        createdAt: order.createdAt
      });
    } catch (err) {
      console.error("Socket emit failed", err);
    }

    res.json({ message: "Order placed!", orderId: order._id });

  } catch (err) {
    console.error("createOrder error", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("userId");
    const items = await OrderItem.find({ orderId: req.params.id }).populate("menuItemId");

    res.json({ order, items });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrdersForUser = async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    const tokenUserId = req.user?.userId;
    const userId = tokenUserId || requestedUserId;

    if (!userId) {
      return res.status(400).json({ message: "User id is required" });
    }

    if (tokenUserId && tokenUserId !== requestedUserId) {
      return res.status(403).json({ message: "Forbidden: cannot view other users' orders" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    if (orders.length === 0) {
      return res.json({ orders: [] });
    }

    const orderIds = orders.map((order) => order._id);
    const items = await OrderItem.find({ orderId: { $in: orderIds } }).populate(
      "menuItemId"
    );

    const itemsByOrderId = new Map();
    items.forEach((item) => {
      const key = item.orderId.toString();
      if (!itemsByOrderId.has(key)) {
        itemsByOrderId.set(key, []);
      }
      itemsByOrderId.get(key).push(item);
    });

    const payload = orders.map((order) => ({
      ...order.toObject(),
      items: itemsByOrderId.get(order._id.toString()) || []
    }));

    res.json({ orders: payload });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const statusFilter = req.query.status?.toString().trim();
    const allowedStatuses = Order.schema.path("status").enumValues;
    const filter = {};

    if (statusFilter) {
      if (!allowedStatuses.includes(statusFilter)) {
        return res.status(400).json({ message: "Invalid order status filter" });
      }
      filter.status = statusFilter;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId");

    if (orders.length === 0) {
      return res.json({ orders: [] });
    }

    const orderIds = orders.map((order) => order._id);
    const items = await OrderItem.find({ orderId: { $in: orderIds } }).populate(
      "menuItemId"
    );

    const itemsByOrderId = new Map();
    items.forEach((item) => {
      const key = item.orderId.toString();
      if (!itemsByOrderId.has(key)) {
        itemsByOrderId.set(key, []);
      }
      itemsByOrderId.get(key).push(item);
    });

    const payload = orders.map((order) => ({
      ...order.toObject(),
      items: itemsByOrderId.get(order._id.toString()) || []
    }));

    res.json({ orders: payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = Order.schema.path("status").enumValues;

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    try {
      const io = getIO();
      io.emit("orderStatusUpdated", {
        orderId: order._id.toString(),
        status: order.status,
        updatedAt: order.updatedAt
      });
    } catch (err) {
      console.error("Socket emit failed", err);
    }

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
