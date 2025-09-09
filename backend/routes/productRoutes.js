import express from "express";
import Product from "../models/product.js";
import upload from "../middleware/upload.js";
import fs from "fs";

const router = express.Router();


// In your product creation route
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, categoryId } = req.body;
    let imageBase64 = null;

    if (req.file) {
      const file = fs.readFileSync(req.file.path);
      imageBase64 = file.toString("base64");
    }

    const newProduct = new Product({
      name,
      price,
      description,
      image: imageBase64,
      category: categoryId || null
    });

    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Products (populate category)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("category"); // Populate category details
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, categoryId } = req.body;
    let updateData = { name, price, description, category: categoryId || null };

    if (req.file) {
      const file = fs.readFileSync(req.file.path);
      updateData.image = file.toString("base64");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("category");

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
