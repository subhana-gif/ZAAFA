import express from "express";
import Category from "../models/category.js";
import upload from "../middleware/upload.js"; // same multer middleware you used for products
import fs from "fs";

const router = express.Router();

// Create Category
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;
    let imageBase64 = null;

    if (req.file) {
      const file = fs.readFileSync(req.file.path);
      imageBase64 = file.toString("base64");
    }

    const category = new Category({
      name,
      description,
      image: imageBase64
    });

    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Categories (excluding soft deleted)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Category (with optional new image)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;
    let updateData = { name, description };

    if (req.file) {
      const file = fs.readFileSync(req.file.path);
      updateData.image = file.toString("base64");
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Soft Delete Category
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    res.json({ message: "Category soft-deleted", category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
