// routes/brandRoutes.js
import express from "express";
import Brand from "../models/brands.js";
import upload from "../middleware/upload.js";

const router = express.Router();


// CREATE Brand
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    let imageBase64 = null;

    // ✅ Case-insensitive check with regex
    const existingBrand = await Brand.findOne({ name: new RegExp(`^${name.trim()}$`, "i") });
    if (existingBrand) {
      return res.status(400).json({ error: "Brand already exists" });
    }

    if (req.file) {
      imageBase64 = req.file.buffer.toString("base64");
    }

    const brand = new Brand({
      name: name.trim(),
      image: imageBase64,
      status: "active",
    });

    await brand.save();
    res.json(brand);
  } catch (err) {
    console.error("error:", err);

    // ✅ Handle Mongo duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ error: "Brand already exists" });
    }

    res.status(500).json({ error: "Error saving brand" });
  }
});

// GET all Brands
router.get("/", async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/user", async (req, res) => {
  try {
    const activeBrands = await Brand.find({ status: "active" });
    res.json(activeBrands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const brand = await Brand.findOne({
      _id: req.params.id,
      status: "active", // ✅ Only active brands
    });

    if (!brand) {
      return res.status(404).json({ error: "Brand not found or inactive" });
    }

    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE Brand
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    let updateData = { name };

    if (req.file) {
      updateData.image = req.file.buffer.toString("base64");
    }

    const brand = await Brand.findByIdAndUpdate(id, updateData, { new: true });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BLOCK / UNBLOCK Brand
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const brand = await Brand.findByIdAndUpdate(id, { status }, { new: true });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
