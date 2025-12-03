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