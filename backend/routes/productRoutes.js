import express from "express";
import Product from "../models/product.js";
import upload from "../middleware/upload.js";
import fs from "fs";

const router = express.Router();

// Create product
router.post("/", upload.array("images", 4), async (req, res) => {
  try {
    const { name, price, description, categoryId, offerId, brandId } = req.body;

    let imageBase64Array = [];
    if (req.files && req.files.length > 0) {
      imageBase64Array = req.files.map(file => file.buffer.toString("base64"));
    }

    const newProduct = new Product({
      name,
      price,
      description,
      images: imageBase64Array,
      category: categoryId || null,
      offer: offerId || null,
      brand: brandId || null,
      status: "active",
    });

    await newProduct.save();
    // Populate for response
    const populatedProduct = await Product.findById(newProduct._id)
      .populate("category")
      .populate("offer")
      .populate("brand");

    res.json(populatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all products (admin)
router.get("/", async (req, res) => {
  try {
    let { limit = 12, page = 1, category, search, status } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) filter.name = { $regex: search, $options: "i" };

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("category")
      .populate("offer")
      .populate("brand")
      .lean();

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all active products for users
router.get("/user", async (req, res) => {
  try {
    let { limit = 12, page = 1, category, search } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    const filter = { status: "active" };
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "category",
        match: { status: "active" },
      })
      .populate({
        path: "offer",
        match: { status: "active" },
      })
      .populate({
        path: "brand",
        match: { status: "active" },
      })
      .lean();

    const filteredProducts = products.filter(
      p => p.category !== null && p.brand !== null
    );

    res.json({
      products: filteredProducts,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("offer")
      .populate("brand")
      .lean();

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product
router.put("/:id", upload.array("newFiles", 4), async (req, res) => {
  try {
    const { name, price, description, categoryId, offerId, brandId } = req.body;

    // existingImages sent from frontend
    let updatedImages = req.body.existingImages || [];

    // Convert uploaded files to base64
    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map(file =>
        file.buffer
          ? file.buffer.toString("base64")
          : fs.readFileSync(file.path).toString("base64")
      );
      updatedImages = [...updatedImages, ...uploadedImages].slice(0, 4);
    }

    const updateData = {
      name,
      price,
      description,
      category: categoryId || null,
      offer: offerId || null,
      brand: brandId || null,
      images: updatedImages,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate("category")
      .populate("offer")
      .populate("brand");

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Block / Unblock product
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body; // "active" or "blocked"

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("category")
      .populate("offer")
      .populate("brand");

    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
