// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: { type: String }, // Base64 string
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" } // Reference to Category
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
  