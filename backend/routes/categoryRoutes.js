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

    // If using memoryStorage, the file buffer is already in req.file.buffer
    if (req.file) {
      imageBase64 = req.file.buffer.toString("base64");
    }

    const category = new Category({
      name,
      description,
      image: imageBase64
    });

    await category.save();
    res.json(category);
  } catch (err) {
    console.log("error:", err);
    res.status(500).json({ error: err.message });
  }
});


// Get All Categories (excluding soft deleted)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/categories/user
router.get("/user", async (req, res) => {
  try {
    const categories = await Category.find({ status: "active" })
      .sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
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
      updateData.image = req.file.buffer.toString("base64"); // ✅ use buffer
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!category) return res.status(404).json({ error: "Category not found" });

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Soft Delete Category
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Status updated", category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
