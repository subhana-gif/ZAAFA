import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  imageUrl: String, // stored as /uploads/filename.jpg
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
