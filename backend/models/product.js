// models/product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    images: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length === 4; // must be exactly 4 images
        },
        message: "Product must have exactly 4 images",
      },
      required: true,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
