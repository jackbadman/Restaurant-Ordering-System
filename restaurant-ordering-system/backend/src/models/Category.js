import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: { 
    type: String,
    lowercase: true,
    trim: true,
    unique: true 
  },

  description: {
    type: String
  }
});

export default mongoose.model("Category", categorySchema);