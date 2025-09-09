import express from "express";
import Product from "../models/product.js";

const router = express.Router();

// OG tag route
router.get("/share/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Construct HTML with OG tags
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${product.name} - Rs.${product.price}</title>
        <meta name="description" content="${product.description}" />

        <!-- Open Graph -->
        <meta property="og:title" content="${product.name}" />
        <meta property="og:description" content="${product.description}" />
        <meta property="og:image" content="data:image/jpeg;base64,${product.image}" />
        <meta property="og:url" content="https://zaafa.vercel.app/product/${product._id}" />
        <meta property="og:type" content="product" />
      </head>
      <body>
        <p>Redirecting to product page...</p>
        <script>
          window.location.href = "https://zaafa.vercel.app/product/${product._id}";
        </script>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

export default router;
