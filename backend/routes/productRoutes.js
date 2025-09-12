import express from "express";
import Product from "../models/product.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Create product
router.post("/", upload.array("images", 4), async (req, res) => {
  try {
    const { name, price, description, categoryId } = req.body;

    let imageBase64Array = [];
    if (req.files && req.files.length > 0) {
      imageBase64Array = req.files.map((file) => file.buffer.toString("base64"));
    }

    const newProduct = new Product({
      name,
      price,
      description,
      images: imageBase64Array,
      category: categoryId || null,
      status: "active",
    });

    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get all products
router.get("/", async (req, res) => {
  try {
    let { limit = 12, page = 1, category, search,status } = req.query;
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
      .lean();

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/user
router.get("/user", async (req, res) => {
  try {
    let { limit = 12, page = 1, category, search } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    // Build filter for products
    const productFilter = { status: "active" }; // only active products
    if (category) productFilter.category = category;
    if (search) productFilter.name = { $regex: search, $options: "i" };

    // Count total active products
    const total = await Product.countDocuments(productFilter);

    // Fetch products with active category
    const products = await Product.find(productFilter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "category",
        match: { status: "active" }, // ✅ only populate active categories
      })
      .lean();

    // Remove products with null category (category was blocked)
    const filteredProducts = products.filter(p => p.category !== null);

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
    const { name, price, description, categoryId } = req.body;

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
      category: categoryId,
      images: updatedImages,
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("category");

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
    );

    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
