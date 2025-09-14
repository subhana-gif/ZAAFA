import express from "express";
import HeroImage from "../models/heroImages.js";
import upload from "../middleware/upload.js"; // using memory storage

const router = express.Router();

// Upload a new hero image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const newImage = new HeroImage({
      imageUrl: imageBase64, // or URL returned by cloud
      isActive: true
    });

    await newImage.save();
    res.json(newImage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all hero images (optionally filter only active)
router.get("/user", async (req, res) => {
  try {
    const { activeOnly } = req.query;
    const query = activeOnly === "true" ? { isActive: true } : {};
    const images = await HeroImage.find(query).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ All hero images (admin / no filter)
router.get("/", async (req, res) => {
  try {
    const images = await HeroImage.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Toggle active/inactive
router.patch("/:id/toggle", async (req, res) => {
  try {
    const image = await HeroImage.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    image.isActive = !image.isActive;
    await image.save();

    res.json({ message: `Image ${image.isActive ? "activated" : "deactivated"}`, image });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
