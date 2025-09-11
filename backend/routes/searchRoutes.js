// routes/search.js
import express from "express";
import Product from "../models/product.js";
import Category from "../models/category.js";

const router = express.Router();

// Autocomplete Search
router.get("/", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const categories = await Category.find({
      name: { $regex: query, $options: "i" },
      isDeleted: false,
    }).select("_id name");

    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    })
      .select("_id name")
      .populate("category", "name");

    res.json({
      categories: categories.map((c) => ({
        type: "category",
        id: c._id,
        name: c.name,
      })),
      products: products.map((p) => ({
        type: "product",
        id: p._id,
        name: p.name,
        category: p.category?.name,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
