// models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String }, // store image as Base64 string or image URL
    status: { type: String, enum: ["active", "blocked"], default: "active" } // ✅
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
