import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;

    const order = await Order.create({ userId });

    for (let item of items) {
      await OrderItem.create({
        orderId: order._id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: item.price
      });
    }

    res.json({ message: "Order placed!", orderId: order._id });

  } catch (err) {
    res.status(500).json({ error: err.message });
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
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User id is required" });
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
