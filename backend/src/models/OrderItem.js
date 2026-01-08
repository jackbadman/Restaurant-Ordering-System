// Order item schema and model.
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Must order at least one"]
  },
  price: {
    type: Number,
    required: true
  }
});

export default mongoose.model("OrderItem", orderItemSchema);
