// routes/search.js
import express from "express";
import Product from "../models/product.js";
import Category from "../models/category.js";

const router = express.Router();

// Search Products & Categories
router.get("/", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // Try to find category match
    const category = await Category.findOne({
      name: { $regex: query, $options: "i" },
      isDeleted: false,
    });

    if (category) {
      return res.json({
        type: "category",
        categoryId: category._id,
      });
    }

    // Try to find product match
    const product = await Product.findOne({
      name: { $regex: query, $options: "i" },
    }).populate("category");

    if (product) {
      return res.json({
        type: "product",
        productId: product._id,
      });
    }

    // Nothing found
    res.json({ type: "none" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
