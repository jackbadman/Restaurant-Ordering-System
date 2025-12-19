import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "preparing", "ready", "completed", "cancelled"], // add an extra table for status???
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

orderSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  if (typeof next === "function") {
    next();
  }
});

export default mongoose.model("Order", orderSchema);
