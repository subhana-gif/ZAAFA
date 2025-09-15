// routes/offerRoutes.js
import express from "express";
import Offer from "../models/offer.js";

const router = express.Router();

// CREATE Offer
router.post("/", async (req, res) => {
  try {
    const { title, description, discountType, discountValue, startDate, endDate } = req.body;

    // ✅ Case-insensitive check for duplicate title
    const existingOffer = await Offer.findOne({ title: new RegExp(`^${title.trim()}$`, "i") });
    if (existingOffer) {
      return res.status(400).json({ error: "Offer already exists" });
    }

    const offer = new Offer({
      title: title.trim(),
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      isActive: true, // default
    });

    await offer.save();
    res.json(offer);
  } catch (err) {
    console.error("Error creating offer:", err);

    // ✅ Handle duplicate key error (if unique index exists in schema)
    if (err.code === 11000) {
      return res.status(400).json({ error: "Offer already exists" });
    }

    res.status(500).json({ error: "Error saving offer" });
  }
});

// GET all Offers
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all offers (filter by isActive if query provided)
router.get("/user", async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single Offer by ID (only active if user mode)
router.get("/:id", async (req, res) => {
  try {
    const { activeOnly } = req.query; // e.g., /api/offers/123?activeOnly=true

    const query = { _id: req.params.id };
    if (activeOnly === "true") {
      query.isActive = true; // only return active
    }

    const offer = await Offer.findOne(query);

    if (!offer) {
      return res.status(404).json({ message: "Offer not found or inactive" });
    }

    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Offer
router.put("/:id", async (req, res) => {
  try {
    const { title, description, discountType, discountValue, startDate, endDate, isActive } =
      req.body;

    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      { title, description, discountType, discountValue, startDate, endDate, isActive },
      { new: true }
    );

    if (!updatedOffer) return res.status(404).json({ message: "Offer not found" });
    res.json(updatedOffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TOGGLE Offer Active/Inactive
router.patch("/:id/toggle", async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    offer.isActive = !offer.isActive;
    await offer.save();

    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
