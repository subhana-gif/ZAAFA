// routes/brandRoutes.js
import express from "express";
import multer from "multer";
import Brand from "../models/brands.js";

const router = express.Router();

// multer in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CREATE Brand
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    let imageBase64 = null;

    if (req.file) {
      imageBase64 = req.file.buffer.toString("base64");
    }

    const brand = new Brand({
      name,
      image: imageBase64,
      status: "active", // default when creating
    });

    await brand.save();
    res.json(brand);
  } catch (err) {
    console.error("error:", err);
    res.status(500).json({ error: err.message });
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
