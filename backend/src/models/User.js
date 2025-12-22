import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "staff", "manager"], // table for role??
    default: "customer",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model("User", userSchema);