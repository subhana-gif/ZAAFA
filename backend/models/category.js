// models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  isDeleted: { type: Boolean, default: false } // Soft delete
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);
