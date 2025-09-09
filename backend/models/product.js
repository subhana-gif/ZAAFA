import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: { type: String }, // Base64 string
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
